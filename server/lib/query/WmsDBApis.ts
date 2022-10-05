import moment from 'moment';
import * as mongoDB from 'mongodb';
import { IPickUp, IPickUpTask } from '#rootTS/bin/pdfGenerator/pdfGenerator';
import wms from "#root/wms/wmsDatabase.js"
import {
    IUnShipment,
    IUnShipmentMap,
    IUpdateShipmentStatusErrorMessage,
    IUpdateShipmentStatusResponse,
    LocationDoc,
    PickUpItemsDoc
} from '@types';
import { GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY, GET_UPC_LOCATION_QTY_EXCEPT_WMS } from '#query/aggregate.js';

interface IWmsCollection {
    [key: string]: string
}

enum Collection {
    Shipment = "shipment",
    SellerInv = "sellerInv",
    LocationInv = "locationInv"
}

/* 
    @desc: for shipment DB docs status
*/
export enum shipmentStatus {
    SHIPPED = "shipped",
    READY = "ready",
    SUBSTANTIATED = "substantiated",
    PICK_UP_CREATED = "pickUpCreated"
}

export class WmsDBApis {
    static readonly Collection = Collection;
    readonly Collection = WmsDBApis.Collection;

    private readonly db: mongoDB.Db;
    static _collection: IWmsCollection = {
        shipment: "shipment",
        sellerInv: "sellerInv",
        locationInv: "locationInv"
    };

    constructor() {
        this.db = wms.db;
    }

    async createPickUpFromReadyShipment(): Promise<{ pickUpData: IPickUp, processedTrackings: Set<string> }> {
        const pickUpDocs: PickUpItemsDoc[] = await this.getPickUpFromShipment(0, 0)
        const { unShipmentHandler, processedTrackings } = this.createUnShipmentMapping(pickUpDocs);
        const pickUptasks: IPickUpTask[] = await this.createPickUpTasks(unShipmentHandler);
        console.log(unShipmentHandler);
        //pickUpData for return
        let pickUpData: IPickUp = {
            tasks: pickUptasks,
            date: moment().format()
        }

        return { pickUpData, processedTrackings };
    }

    async getPickUpFromShipment(limit: number, skip: number): Promise<PickUpItemsDoc[]> {
        const collection: mongoDB.Collection<PickUpItemsDoc> = this.db.collection(WmsDBApis._collection.shipment);
        let pickUpDocs: PickUpItemsDoc[] = (await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY).toArray()) as PickUpItemsDoc[];

        return pickUpDocs;
    }

    createUnShipmentMapping(docs: PickUpItemsDoc[]): IUnShipment {
        const unShipmentHandler: IUnShipmentMap = new Map();
        const processedTrackings = new Set<string>();

        docs.forEach(notShippedDoc => {
            const { tracking, rcIts } = notShippedDoc;
            rcIts.forEach(({ UPC, qty }) => {
                let hasUnShippedUpc: boolean = unShipmentHandler.get(UPC) === undefined ? false : true;
                if (hasUnShippedUpc) {
                    let prevRcIts = unShipmentHandler.get(UPC);
                    unShipmentHandler.set(UPC, {
                        ...prevRcIts,
                        qty: prevRcIts!.qty + qty,
                        trackings: [...prevRcIts!.trackings, tracking]
                    })
                } else {
                    unShipmentHandler.set(UPC, {
                        qty: qty,
                        trackings: [tracking]
                    })
                }
            })
            processedTrackings.add(tracking);
        })
        return { unShipmentHandler, processedTrackings }
    }

    async createPickUpTasks(unShipmentMap: IUnShipmentMap): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[];
        pickUpTasks = await Array.from(unShipmentMap).reduce<Promise<IPickUpTask[]>>(async (prevPromise, [upc, { qty }]) => {
            let prev = await prevPromise;
            let newTasks = await this.findPickUpLocationsByUnShippedUpcAndQty(upc, qty);
            return [...prev, ...newTasks]
        }, Promise.resolve([]))

        const sorted: IPickUpTask[] = pickUpTasks.sort((first: IPickUpTask, second: IPickUpTask) => {
            const extractShelveRegex = /^(\d+).*$/
            const naRegex = /not available/i
            let firstLoc = first.location;
            let secondLoc = second.location;
            let firstShelvesMatch = extractShelveRegex.exec(firstLoc);
            let secondShelvesMatch = extractShelveRegex.exec(secondLoc);

            let firstShelves: number = firstShelvesMatch == null ? -1 : Number(firstShelvesMatch[1]);
            let secondShelves: number = secondShelvesMatch == null ? -1 : Number(secondShelvesMatch[1]);

            //could have better method...
            if (firstShelvesMatch == null)
                firstShelves = naRegex.exec(firstLoc) == null ? firstShelves : -2

            if (secondShelvesMatch == null)
                secondShelves = naRegex.exec(secondLoc) == null ? secondShelves : -2

            return firstShelves - secondShelves;
        })
        return sorted;
    }

    async findPickUpLocationsByUnShippedUpcAndQty(upc: string, qty: number): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[] = new Array()
        const collection: mongoDB.Collection = this.db.collection(WmsDBApis._collection.locationInv);
        let upcLocQtyDocs: LocationDoc[] = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray() as LocationDoc[];

        //upc not exists in db
        if (upcLocQtyDocs.length === 0) {
            let NotAvailablePickUpTask: IPickUpTask[] = new Array({ upc, qty, location: "Not Available" })
            return NotAvailablePickUpTask;
        }

        let unProcessedQty: number = qty;
        //iterate and process location qty
        for (const doc of upcLocQtyDocs) {
            const isQtyOnLocationEnough: boolean = doc.qty >= unProcessedQty ? true : false;
            if (isQtyOnLocationEnough) {
                pickUpTasks.push({ upc, qty: unProcessedQty, location: doc.loc })
                return pickUpTasks;
            }
            //qty on location smaller than request qty, keep pushing to pickUptasks
            pickUpTasks.push({ upc, qty: doc.qty, location: doc.loc });
            unProcessedQty -= doc.qty;
        }

        //all location qty not enough
        if (unProcessedQty > 0) {
            let wmsLocPickUpTask: IPickUpTask = { upc, location: "WMS", qty: unProcessedQty }
            pickUpTasks.push(wmsLocPickUpTask);
        }

        return pickUpTasks;

    }

    /* 
        @desc: update shipment docs: operStatus field to new status
    */
    async updateShipmentStatus(trackingID: string, newStatus: shipmentStatus) {
        let query = { "_id": trackingID }
        let update = { $set: { "operStatus": newStatus } }

        try {
            const collection: mongoDB.Collection = this.db.collection(WmsDBApis.Collection.Shipment);
            const updateResult: mongoDB.UpdateResult = await collection.updateOne(query, update);
            let isUpdated: boolean = updateResult.modifiedCount === 1 ? true : false;
            const updateQueryResp: IUpdateShipmentStatusResponse = {
                action: "updateShipmentStatus",
                trackingID,
                newStatus,
                queryRes: isUpdated
            }

            return updateQueryResp;

        } catch (err) {
            let errMsg: IUpdateShipmentStatusErrorMessage = { action: "updateShipmentStatus", msg: `Shipment tracking: ${trackingID} rejected.`, rejectedTracking: trackingID };
            throw errMsg;
        }
    }

    async updateAllShipmentStatus(trackings: Set<string>, newStatus: shipmentStatus) {
        return Promise.allSettled(
            Array.from(trackings)
                .map(trackingID =>
                    new Promise((resolve, reject) => {
                        this.updateShipmentStatus(trackingID, newStatus)
                            .then(result => resolve(result))
                            .catch((err: IUpdateShipmentStatusErrorMessage) => {
                                let rejectResponse: IUpdateShipmentStatusErrorMessage = {
                                    action: err.action,
                                    msg: err.msg,
                                    rejectedTracking: err.rejectedTracking,
                                }
                                reject(rejectResponse)
                            })
                    })
                )
        )
    }

    /* 
        @warning: donot use for now
        @desc: currently invalid for use
    */
    async promiseAllSettledAction(iterableObj: Set<any> | Map<any, any>, actionCb: () => any) {
        return Promise.allSettled(
            Array.from(iterableObj)
                .map(element =>
                    new Promise((resolve, reject) => {
                        actionCb()
                            .then((result: any) => {
                                resolve(result)
                            })
                            .catch((err: Error) => {
                                reject(err.message)
                            })
                    })
                )
        )
    }

}