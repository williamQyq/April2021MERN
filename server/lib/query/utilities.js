import ItemSpec from '../models/Spec.js';
import { AmzProdPricing, AmzIdentifier } from '../models/Amz.js';
import wms from '#wms/wmsDatabase.js';
import mongoose from 'mongoose';


const { ObjectId } = mongoose.Types;
import {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
    UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
    LOOKUP_ITEM_SPEC,
    LAST_PRICE,
    GET_INVENTORY_RECEIVED_HALF_MONTH_AGO
} from './aggregate.js';
import GenerateGSheetApis from '../../bin/gsheet/gsheet.js';
import moment from 'moment';

//@itemSpec
export const saveItemConfiguration = async (config, sku) => {

    const query = { upc: config.UPC, sku: sku }
    const update = {
        $setOnInsert: {
            spec: config
        }
    }
    const option = { upsert: true, new: true, useFindAndModify: false, }
    let doc = await ItemSpec.findOneAndUpdate(query, update, option)
    return doc;
}
//@itemSpec
export const findItemConfigDocumentOnSku = async (sku) => {
    let doc = await ItemSpec.findOne({ sku: sku })
    return doc;
}
//@StoreListings -----------------------------
export const saveStoreItemToDatabase = async (item, storeModel) => {
    let msg = '';
    let isUpserted = await setOnInsert(item, storeModel)    //insert if no document

    if (!isUpserted) {
        //push updated price to priceTimestamps field
        let isPricedPushed = await updateItemIfPriceChanged(item, storeModel)
        msg = isPricedPushed ? "UPDATED PRICE" : "PRICE NOT CHANGED"
    }
    else {
        msg = "NEW ITEM UPSERT"
    }

    return msg

}

export const setOnInsert = async (item, storeModel) => {
    const query = { sku: item.sku };
    const update = {
        $setOnInsert: {
            sku: item.sku,
            name: item.name,
            link: item.link,
            price_timestamps: [{
                price: item.currentPrice
            }]
        }
    };
    const options = { upsert: true };
    let isUpserted = await storeModel.updateOne(query, update, options)
        .then(result => result.upserted ? true : false)

    return isUpserted
}

//updateItemIfPriceChanged(item:Item, storeModel:Mongoose<model>)-> enum<true|false>isItemPriceChanged
export const updateItemIfPriceChanged = (item, storeModel) => {
    return storeModel.aggregate([
        {
            $project: {
                sku: 1,
                updatePrice: item.currentPrice,
                isPriceChanged: {        //check if capture price equal current price in db.
                    $ne: [
                        item.currentPrice,       //lastest price from scrape
                        LAST_PRICE             //price in db
                    ]
                }
            }
        },
        {
            $match: {
                sku: item.sku,
                isPriceChanged: true
            }
        }
    ]).then(async (docs) => {
        if (docs.length == 0)
            return false

        await Promise.all(docs.map(doc => pushUpdatedPrice(doc, item, storeModel)))
        return true
    })
}

export const pushUpdatedPrice = (doc, item, storeModel) => {
    let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
    let update = {
        $push: {
            price_timestamps: {
                price: item.currentPrice
            }
        }
    }

    return storeModel.findByIdAndUpdate(doc._id, update, options)

}
//----------------------------

//@StoreListings
export const getStoreItems = (Model) => (
    Model.aggregate([
        LOOKUP_ITEM_SPEC,
        UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE,

    ])
)
//@StoreListings
export const getStoreItemDetailById = (Model, _id) => (
    Model.aggregate([
        PROJ_ITEM_DETAIL,
        {
            $match: {
                _id: ObjectId(_id)
            }
        }
    ])
)
//@AmzProdPricing
export const findAllProdPricing = () => {
    let query = {
        "upc": { $exists: true },
        "identifiers": { $exists: true }
    }
    return AmzProdPricing.find(query)
}
//@AmzProdPricing
export const findProdPricingOnUpc = (upc) => {
    return AmzProdPricing.find({ upc: upc })
}
//@AmzProdPricing
export const updateProdPricingOffer = (upc, asin, offers) => {
    const filter = { "upc": upc, "identifiers.asin": asin }
    const update = { $set: { "identifiers.$.offers": offers } }
    const option = { useFindAndModify: false }
    return AmzProdPricing.findOneAndUpdate(filter, update, option)

}
//@AmzProdPricing
export const upsertProdPricingNewAsin = (upc, asin) => {
    let newIdentifier = new AmzIdentifier({ asin })
    let newProd = new AmzProdPricing({ upc, identifiers: new Array() })

    let query = { "upc": upc }
    let update = { $setOnInsert: { newProd } }
    let option = { upsert: true, new: true, useFindAndModify: false };
    return AmzProdPricing.updateOne(query, update, option)  //set on insert for new upc
        .then(() => {
            let query = { "upc": upc }
            let update = { $pull: { "identifiers": { "asin": asin } } }
            return AmzProdPricing.updateOne(query, update)
        })
        .then(() => {
            let query = { "upc": upc }
            let update = { $push: { identifiers: newIdentifier } }
            return AmzProdPricing.updateOne(query, update)
        })

}

export class WMSDatabaseApis {
    static _collection = {
        sellerInv: "sellerInv",
        inventoryReceive: "inventoryReceive"
    }
    constructor() {
        this.db = wms.getDatabase();
    }
    async getInventoryReceive() {
        const collection = this.db.collection(WMSDatabaseApis._collection.inventoryReceive);
        let invRecItemsHalfMonthAgo = await collection.aggregate(GET_INVENTORY_RECEIVED_HALF_MONTH_AGO).toArray();
        return invRecItemsHalfMonthAgo;
    }


}

export class GsheetApis extends GenerateGSheetApis {
    static _forUploadSpreadSheet = {
        spreadsheetId: "1xvMFkK3dvNwhHHXqRnJPLko_ouTZ5llyA3jYauxWPBM",
        range: "Sheet2!B:F",
        order: {
            mdfTmEst: null,
            orgNm: null,
            UPC: null,
            trNo: null,
            qty: null
        }
    }
    constructor() {
        super();
    }

    async updateSheet(spreadSheetDetail, aoa) {
        const { spreadsheetId, range } = spreadSheetDetail;

        const spreadSheet = await this._getSpreadSheet(); //await for googleSheets instance
        const auth = this.auth;

        await spreadSheet.values.clear({ auth, spreadsheetId, range });
        await spreadSheet.values.update(
            {
                auth,
                spreadsheetId,
                range,
                valueInputOption: "USER_ENTERED",
                requestBody: { "values": aoa }
            }).data;

    }

    async readSheet(spreadSheetDetail, range) {
        const { spreadsheetId } = spreadSheetDetail;
        const spreadSheet = await this._getSpreadSheet();

        let readData = await spreadSheet.values.get({
            auth,
            spreadsheetId,
            range
        }).data

        return readData
    }
    createArrayOfArrayFromDocumentsInOrder(spreadSheetDetail, docs) {
        let aoa;
        let keys;
        let order = spreadSheetDetail.order;
        let now = moment().format();

        keys = this._getInOrderKeys(order, docs);
        if (keys !== undefined) {
            aoa = this._getInOrderValues(order, docs);
            aoa.unshift(keys, new Array(now))
        }
        return aoa;
    }

    _getInOrderKeys(sheetOrder, docs) {
        let keys;
        if (docs.length > 0) {
            // let firstDoc = docs[0];
            keys = Object.keys(sheetOrder);
        }
        return keys;
    }
    _getInOrderValues(sheetOrder, docs) {
        let values = docs.map(doc => {
            let inOrderDoc = Object.assign(sheetOrder, doc)
            return Object.values(inOrderDoc)
        })
        return values;
    }
}