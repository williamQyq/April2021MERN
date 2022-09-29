import moment from 'moment';
import * as mongoDB from 'mongodb';
import { IPickUp } from 'root/bin/pdfGenerator/pdfGenerator';
import { wms } from "root/wms/wmsDatabase"

interface IWmsCollection {
    [key: string]: string
}
export class WmsDBApis {
    private db: mongoDB.Db;
    static _collection: IWmsCollection = {
        shipment: "shipment",
        sellerInv: "sellerInv"
    }

    constructor() {
        this.db = wms.getDatabase();
    }


    async createPickUpFromReadyShipment(): Promise<IPickUp> {
        const data: IPickUp = {
            tasks: [
                {
                    upc: "123456789",
                    location: "1A-1",
                    qty: 2
                }
            ],
            date: moment().format()
        }

        const collection: mongoDB.Collection = this.db.collection(WmsDBApis._collection.shipment);
        // let docs = await collection.aggregate().toArray();
        // ...working on

        return data
    }
}