import moment from 'moment';
import * as mongoDB from 'mongodb';
import { IPickUp, IPickUpTask } from '#rootTS/bin/pdfGenerator/pdfGenerator';
import wms from "#root/wms/wmsDatabase.js"
import {
    IAwaitingShipment,
    IAwaitingShipmentMap,
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

    async createPickUpFromReadyShipment(forUpgradeTrackings: Set<string | undefined>): Promise<{ pickUpData: IPickUp, processedTrackings: Set<string> }> {
        //get all items that need picked up
        const pickUpDocs: PickUpItemsDoc[] = await this.getPickUpFromShipment(0, 0)

        //create Mapping: all need picked up upc map qty location

        const forUpgrade = this.createNeedShippingMapping(pickUpDocs, forUpgradeTrackings);
        const forOrig = this.createNeedShippingMapping(pickUpDocs, forUpgrade.unPorcessedTrackings)

        //seperate need upgrade upc tasks on needUpgradeTrackings
        const origTasks: IPickUpTask[] = await this.createPickUpTasks(forOrig.awaitingShipmentMapping);
        const upgradeTasks: IPickUpTask[] = await this.createPickUpTasks(forUpgrade.awaitingShipmentMapping);

        const processedTrackings = new Set([...forOrig.processedTrackings, ...forUpgrade.processedTrackings]);
        console.log(`Orig Map: \n`, forOrig.awaitingShipmentMapping);
        console.log(`Upgrade Map: \n`, forUpgrade.awaitingShipmentMapping);

        console.log(`special trackings:`, forUpgradeTrackings)
        console.log(origTasks)
        //pickUpData for return
        let pickUpData: IPickUp = {
            origTasks,
            upgradeTasks,
            date: moment().format()
        }

        return { pickUpData, processedTrackings };
    }

    async getPickUpFromShipment(limit: number, skip: number): Promise<PickUpItemsDoc[]> {
        const collection: mongoDB.Collection<PickUpItemsDoc> = this.db.collection(WmsDBApis._collection.shipment);
        let pickUpDocs: PickUpItemsDoc[] = (await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY).toArray()) as PickUpItemsDoc[];

        return pickUpDocs;
    }

    createNeedShippingMapping(docs: PickUpItemsDoc[], awaitShipmentTrackings: Set<string | undefined>): IAwaitingShipment {
        // const needShippingAllMapping: IUnShipmentMap
        const awaitingShipmentMapping: IAwaitingShipmentMap = new Map();
        const processedTrackings = new Set<string>();
        const unPorcessedTrackings = new Set<string>();

        docs.forEach(awaitingShipmentDoc => {
            const { tracking, rcIts } = awaitingShipmentDoc;

            let isAwaitShipment = awaitShipmentTrackings.has(tracking);
            if (isAwaitShipment) {
                //create upc, await shipment qty Mapping
                rcIts.forEach(({ UPC, qty }) => {
                    let hasUpc: boolean = awaitingShipmentMapping.has(UPC);
                    if (hasUpc) {
                        let prevRcIts = awaitingShipmentMapping.get(UPC)!;
                        awaitingShipmentMapping.set(UPC, {
                            ...prevRcIts,
                            qty: prevRcIts.qty + qty,
                            trackings: [...prevRcIts.trackings, tracking]
                        })
                    } else {
                        awaitingShipmentMapping.set(UPC, {
                            qty,
                            trackings: [tracking],
                        })
                    }
                })
                processedTrackings.add(tracking);
            } else {
                unPorcessedTrackings.add(tracking);
            }

        })

        return { awaitingShipmentMapping, processedTrackings, unPorcessedTrackings }
    }

    async createPickUpTasks(awaitingShipmentMap: IAwaitingShipmentMap): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[];
        pickUpTasks = await Array.from(awaitingShipmentMap)
            .reduce<Promise<IPickUpTask[]>>(
                async (prevPromise, [upc, { qty }]) => {
                    let prev = await prevPromise;
                    let newTasks: IPickUpTask[] = await this.findPickUpLocationsByUpcAndQty(upc, qty);
                    return [...prev, ...newTasks]
                }, Promise.resolve([]))

        //sort pick up tasks on location
        const sortedPickUpTasks: IPickUpTask[] = pickUpTasks.sort((first: IPickUpTask, second: IPickUpTask) => {
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
        return sortedPickUpTasks;
    }

    async findPickUpLocationsByUpcAndQty(upc: string, qty: number): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[] = new Array()
        const collection: mongoDB.Collection = this.db.collection(WmsDBApis._collection.locationInv);
        let upcLocQtyDocs: LocationDoc[] = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray() as LocationDoc[];

        //upc location not exists in db
        if (upcLocQtyDocs.length === 0) {
            let NotAvailablePickUpTask: IPickUpTask[] = new Array({ upc, qty, location: "Not Available", backUpLocs: [] })
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