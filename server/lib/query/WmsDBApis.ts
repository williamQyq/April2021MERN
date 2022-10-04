import moment from 'moment';
import * as mongoDB from 'mongodb';
import { IPickUp, IPickUpTask } from '#rootTS/bin/pdfGenerator/pdfGenerator';
import wms from "#root/wms/wmsDatabase.js"
import { IUnShipment, IUnShipmentMap, LocationDocs, PickUpItemsDocs } from '@types';
import { GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY, GET_UPC_LOCATION_QTY_EXCEPT_WMS } from '#query/aggregate.js';

interface IWmsCollection {
    [key: string]: string
}
export class WmsDBApis {
    private db: mongoDB.Db;
    static _collection: IWmsCollection = {
        shipment: "shipment",
        sellerInv: "sellerInv",
        locationInv: "locationInv"
    }

    constructor() {
        this.db = wms.getDatabase();
    }

    async createPickUpFromReadyShipment(): Promise<IPickUp> {

        const pickUpDocs: PickUpItemsDocs = await this.getPickUpFromShipment(0, 0)
        const { unShipmentHandler, processedTrackings } = this.createUnShipmentMapping(pickUpDocs);
        const pickUptasks: IPickUpTask[] = await this.createPickUpTasks(unShipmentHandler);
        console.log(unShipmentHandler);
        //pickUpData for return
        let pickUpData: IPickUp = {
            tasks: pickUptasks,
            date: moment().format()
        }

        return pickUpData;
    }

    async getPickUpFromShipment(limit: number, skip: number): Promise<PickUpItemsDocs> {
        const collection: mongoDB.Collection = this.db.collection(WmsDBApis._collection.shipment);
        let pickUpDocs: PickUpItemsDocs = await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY).toArray();
        return pickUpDocs;
    }

    createUnShipmentMapping(docs: PickUpItemsDocs): IUnShipment {
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
        return pickUpTasks;
    }

    async findPickUpLocationsByUnShippedUpcAndQty(upc: string, qty: number): Promise<IPickUpTask[]> {
        let pickUpTasks: IPickUpTask[] = new Array()
        const collection: mongoDB.Collection = this.db.collection(WmsDBApis._collection.locationInv);
        let upcLocQtyDocs: LocationDocs = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray();

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

}