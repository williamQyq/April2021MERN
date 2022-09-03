import ItemSpec from '../models/Spec.js';
import BestbuyAlertModel from "../models/BBItem.js";
import MicrosoftAlertModel from "../models/MsItem.js";
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
    GET_INVENTORY_RECEIVED_HALF_MONTH_AGO,
    GET_NEED_TO_SHIP_ITEMS_BY_TODAY,
    COUNT_NEED_TO_SHIP_ITEMS_BY_TODAY,
    COUNT_SHIPMENT_BY_TODAY,
    GET_UNVERIFIED_SHIPMENT,
    GET_LOCINV_UPC_QTY_SUM_EXCLUDE_WMS,
    GET_UPC_LOCATION_QTY_EXCEPT_WMS,
    GET_LOCATION_QTY_BY_UPC_AND_LOC,
    GET_SHIPMENT_BY_COMPOUND_FILTER,
    GET_INVENTORY_RECEIVED_BY_COMPOUND_FILTER
} from './aggregate.js';
import GenerateGSheetApis from '../../bin/gsheet/gsheet.js';
import moment from 'moment';

//@desc Api for ERP application
//@desc next version, currently not used.
export class OpenApi {
    constructor() {

    }
    getItemSpecModel() {
        return ItemSpec;
    }
    getAmazonProdPricingModel() {
        return AmzProdPricing;
    }
    getBestbuyAlertModel() {
        return BestbuyAlertModel;
    }
    getMicrosoftAlertModel() {
        return MicrosoftAlertModel;
    }
    getAmazonProdPricingIdentifierModel() {
        return AmzIdentifier;
    }


}

//@desc Api for ERP application - Alert
//@desc next version, currently not used.
export class AlertApi extends OpenApi {
    constructor() {
        super();
    }

    async upsertItemConfiguration() {
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

    async findItemConfigDocumentOnSku(sku) {
        let doc = await ItemSpec.findOne({ sku: sku })
        return doc;
    }

    async saveStoreItemToDatabase(item, storeModel) {
        let msg = '';
        let isUpserted = await this._setStoreItemPriceOnInsert(item, storeModel)    //insert if no document

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
    async _setStoreItemPriceOnInsert(item, storeModel) {
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

    async updateItemIfPriceChanged(currentItemDetail, storeModel) {
        const { sku, currentPrice } = currentItemDetail;

        let priceChangedItems = await storeModel.aggregate([
            {
                $project: {
                    sku: 1,
                    updatePrice: currentPrice,
                    isPriceChanged: {        //check if capture price equal current price in db.
                        $ne: [
                            currentPrice,       //lastest price from scrape
                            LAST_PRICE             //price in db
                        ]
                    }
                }
            },
            {
                $match: {
                    sku,
                    isPriceChanged: true
                }
            }
        ])
        if (priceChangedItems.length === 0) return false;

        return Promise.all(
            priceChangedItems.map(needUpdateItem =>
                this._pushUpdatedPrice(needUpdateItem, currentItemDetail, storeModel)
            )
        )

    }

    async _pushUpdatedPrice(needUpdateItem, item, storeModel) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
        let update = {
            $push: {
                price_timestamps: {
                    price: item.currentPrice
                }
            }
        }

        let updatedItemDoc = await storeModel.findByIdAndUpdate(needUpdateItem._id, update, options)

        return updatedItemDoc;
    }

    async getStoreItems(Model) {

        let storeItemsDetail = await Model.aggregate([
            LOOKUP_ITEM_SPEC,
            UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
            PROJ_ITEM,
            SORT_ON_CAPTURE_DATE,

        ])

        return storeItemsDetail;
    }

    async getStoreItemDetailById(Model, _id) {
        let storeItemDetail = await Model.aggregate([
            PROJ_ITEM_DETAIL,
            {
                $match: {
                    _id: ObjectId(_id)
                }
            }
        ])

        return storeItemDetail;

    }
    async saveItemConfiguration(config, sku) {
        let itemSpecModel = this.getItemSpecModel();
        const query = { upc: config.UPC, sku: sku }
        const update = {
            $setOnInsert: {
                spec: config
            }
        }
        const option = { upsert: true, new: true, useFindAndModify: false, }
        let doc = await itemSpecModel.findOneAndUpdate(query, update, option)
        return doc;
    }


}

export class OperationApi extends OpenApi {
    constructor() {
        super();
        this.prodPricingModel = this.getAmazonProdPricingModel();
        this.prodPricingIdentifier = this.getAmazonProdPricingIdentifierModel();
    }

    //@desc get recorded amazon product pricing from database
    async findAllProdPricing() {
        let query = {
            "upc": { $exists: true },
            "identifiers": { $exists: true }
        }
        let productPricingDetail = await this.prodPricingModel.find(query);
        return productPricingDetail;
    }
    async findProdPricingOnUpc(upc) {
        return this.prodPricingModel.find({ upc: upc })
    }
    async updateProdPricingOffer(upc, asin, offers) {
        const filter = { "upc": upc, "identifiers.asin": asin }
        const update = { $set: { "identifiers.$.offers": offers } }
        const option = { useFindAndModify: false }
        await this.prodPricingModel.findOneAndUpdate(filter, update, option)

    }
    async upsertProdPricingNewAsin(upc, asin) {
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

}

export class WMSDatabaseApis {
    static _collection = {
        sellerInv: "sellerInv",
        inventoryReceive: "inventoryReceive",
        shipment: "shipment",
        locationInv: "locationInv"
    }
    constructor() {
        this.db = wms.getDatabase();
    }
    async findUpcQtyOnOrg(upc, org = "M") {
        const collection = this.db.collection(WMSDatabaseApis._collection.sellerInv);
        let qty = await collection.findOne({ '_id.UPC': upc, '_id.org': org })
            .then(doc => doc.qty)
        return qty;
    }
    async findUpcQtyMultiOnOrg(upcArr, org = "M") {
        const collection = this.db.collection(WMSDatabaseApis._collection.sellerInv);
        let upcQtyArr = await collection.find({ '_id.UPC': { $in: upcArr }, '_id.org': org }).toArray()
        return upcQtyArr;
    }

    //@desc: deprecat soon
    async getInventoryReceiveInHalfMonth() {
        const collection = this.db.collection(WMSDatabaseApis._collection.inventoryReceive);
        let invRecItemsHalfMonthAgo = await collection.aggregate(GET_INVENTORY_RECEIVED_HALF_MONTH_AGO).toArray();
        return invRecItemsHalfMonthAgo;
    }

    async getNeedToShipFromShipment(docLimits = 10, docSkip = 0) {
        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let needToShipItemsByToday = await collection.aggregate(GET_NEED_TO_SHIP_ITEMS_BY_TODAY(docLimits, docSkip)).toArray();
        return needToShipItemsByToday;
    }

    //Get all org pending shipment Info by default.
    async getPendingShipmentInfoByOrgNm(orgNm) {
        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let pendingShipmentCountByToday = await collection.aggregate(COUNT_SHIPMENT_BY_TODAY(orgNm)).toArray();

        //handle no shipment document by today
        if (pendingShipmentCountByToday.length === 0) {
            return ({ pending: 0, total: 0, confirm: 0 });
        }
        return pendingShipmentCountByToday[0];
    }
    async countNeedToShipFromShipment() {
        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let shipmentCountByToday = await collection.aggregate(COUNT_NEED_TO_SHIP_ITEMS_BY_TODAY).toArray();
        let count = shipmentCountByToday.length > 0 ? shipmentCountByToday[0].shipmentCount : 0
        return count;
    }

    async updateInventoryReceiveOrgNmOnTracking(tracking, newOrgNm) {
        const collection = this.db.collection(WMSDatabaseApis._collection.inventoryReceive);
        let trackingFilter = { trNo: tracking };
        let orgNmUpdate = { $set: { orgNm: newOrgNm } };
        let updateOrgNmByTracking = await collection.findOneAndUpdate(trackingFilter, orgNmUpdate, { returnNewDocument: true });
        return updateOrgNmByTracking;
    }

    //@desc: get shipped status and operStatus unverified shipment docs
    async getShippedNotVerifiedShipment(startDateUnix) {
        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let unverifiedShipment = await collection.aggregate(GET_UNVERIFIED_SHIPMENT(startDateUnix)).toArray();
        return unverifiedShipment;
    }
    async updateSellerInvQtyByUpcAndOrgNm(upc, orgNm, qty) {
        const query = {
            "_id.UPC": upc,
            "_id.org": orgNm,
            "qty": { $gte: qty }
        }
        const update = {
            $inc: { "qty": -qty }
        }

        const collection = this.db.collection(WMSDatabaseApis._collection.sellerInv);
        try {
            let sellerInvUpdatedResult = (await collection.updateOne(query, update)).result;
            return ({
                action: "updateSellerInvQtyByUpcAndOrgNm",
                orgNm,
                upc,
                needToShipQty: qty,
                queryRes: sellerInvUpdatedResult
            });
        } catch (err) {
            throw ({ reason: `SellerInv: ${upc} does not have enought qty.\n Need ${qty}` })
        }
        //@TEST 
        // throw ({ reason: `SellerInv: ${upc} does not have enought qty.\n Need ${qty}` })
    }

    /**
     * @desc:
     * 1. handle locQty on "WMS" only: no action needed.
     * 2. qty on location except "WMS" is not enough and "WMS" do not have enough qty: throw error.
     * 3. subtract shipped qty from every location sorting on qty until all qty shipped. *increment "WMS" loc shipped qty.
     */
    async updateLocationInvQtyByUpc(upc, reqProcQty) {
        let unProcQty = reqProcQty;
        const collection = this.db.collection(WMSDatabaseApis._collection.locationInv);
        let cursors = await collection.aggregate(GET_LOCINV_UPC_QTY_SUM_EXCLUDE_WMS(upc)).toArray();

        let hasQtyOnWMSOnly = cursors.length === 0 ? true : false;
        // do nothing, if no location qty sum documents exclude “WMS" are found.
        if (hasQtyOnWMSOnly) {
            return ({
                action: "updateLocationInvQtyByUpc",
                msg: "No location other than WMS exists, no action taken"
            });
        }

        let qtyOnLocExceptWMS = cursors[0].sum;
        let locHasEnoughQty = qtyOnLocExceptWMS >= unProcQty ? true : false;

        let locWMSQty = (await collection.aggregate(GET_LOCATION_QTY_BY_UPC_AND_LOC(upc, "WMS")).toArray())[0].qty;

        let locWMSHasEnoughQty = locWMSQty >= (reqProcQty - qtyOnLocExceptWMS) ? true : false;

        try {
            const upcLocQtyDocs = await collection.aggregate(GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc)).toArray();
            if (!locHasEnoughQty && !locWMSHasEnoughQty) {
                throw new Error(`locInv: ${upc} does not have enought qty.\n Need ${unProcQty}`)
            }

            for (const doc of upcLocQtyDocs) {

                if (doc.qty < unProcQty) { //cur loc does not have enough qty for deduction
                    const findLocDocQuery = {
                        "_id.UPC": doc.upc,
                        "_id.loc": doc.loc
                    }
                    const update = {
                        $set: { "qty": 0 }
                    }
                    await collection.updateOne(findLocDocQuery, update)
                    unProcQty -= doc.qty;   //subtract qty from locInv
                } else if (doc.qty >= unProcQty) {
                    const findLocDocQuery = {
                        "_id.UPC": doc.upc,
                        "_id.loc": doc.loc
                    }
                    const update = {
                        $inc: { "qty": -unProcQty }
                    }
                    await collection.updateOne(findLocDocQuery, update)
                    unProcQty = 0
                    break;  //all qty processed, quit locqtyDocs iteration
                }
            }

            const findWMSDocQuery = {
                "_id.UPC": upc,
                "_id.loc": "WMS",
            }
            const update = {
                $inc: { "qty": reqProcQty }
            }
            await collection.updateOne(findWMSDocQuery, update)

            return ({
                action: "updateLocationInvQtyByUpc",
                upc,
                reqProcQty: reqProcQty,
                procQty: reqProcQty - unProcQty
            })
        } catch (err) {
            console.log(`locInv err: `, JSON.stringify(err, null, 4))
            throw new Error(`locationInv: unable to get loc qty for upc ${upc}`)
        }
    }
    async updateShipmentStatus(trackingID, newStatus) {
        let query = {
            "_id": trackingID,
        }
        let update = {
            $set: { "operStatus": newStatus }
        }
        try {
            const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
            let isShipmentStatusUpdated = (await collection.updateOne(query, update)).result;
            return ({
                action: "updateShipmentStatus",
                trackingID,
                newStatus,
                queryRes: isShipmentStatusUpdated
            });
        } catch (err) {
            throw ({ msg: `Shipment tracking: ${trackingID} rejected.`, rejectedTracking: trackingID })
        }
        //@TEST 
        // throw ({ reason: `Shipment tracking: ${trackingID} status update failed.` })
    }

    //@usage: router, method: POST, path: '/needToShip/confirmShipment'
    createUnShipmentMapping(allUnShipment) {
        let unShipmentHandler = new Map();
        let processedTrackings = new Set();

        allUnShipment.forEach((unShipment) => {
            const { orgNm, trackingID, rcIts } = unShipment;
            rcIts.forEach(([unShippedUpc, unShippedQty]) => {

                unShippedQty = Number(unShippedQty);
                let hasUnShippedUpc = unShipmentHandler.get(unShippedUpc) === undefined ? false : true
                if (hasUnShippedUpc) {
                    let prevRcIts = unShipmentHandler.get(unShippedUpc);
                    unShipmentHandler.set(unShippedUpc,
                        {
                            ...prevRcIts,
                            unShippedQty: prevRcIts.unShippedQty + unShippedQty,
                            orgNm: unShipment.orgNm,
                            trackings: [...prevRcIts.trackings, trackingID]
                        }
                    )
                } else {
                    unShipmentHandler.set(unShippedUpc,
                        {
                            unShippedQty: unShippedQty,
                            orgNm: orgNm,
                            trackings: [trackingID]
                        }
                    );
                }
            })
            processedTrackings.add(unShipment.trackingID)
        })

        return { unShipmentHandler, processedTrackings }
    }

    async findAndModifyShipment() {
        // let update = {
        //     $set: { "status": newStatus }
        // }
        let pipeline = [
            {
                '$project': {
                    'status': 1,
                    'orderID': 1,
                    'rcIts': 1,
                    'crtTm': 1,
                    'mdfTm': 1,
                    'UPCandSN': 1,
                    'ymd': {
                        '$dateToString': {
                            'format': '%Y-%m-%d',
                            'date': {
                                '$toDate': '$mdfTm'
                            }
                        }
                    }
                }
            }, {
                '$match': {
                    'status': {
                        '$ne': 'shipped'
                    },
                    'ymd': {
                        '$gte': '2022-08-08',
                        '$lt': '2022-08-15'
                    }
                }
            }, {
                '$sort': {
                    'ymd': -1
                }
            }
        ];

        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let docs = await collection.aggregate(pipeline).toArray();
        for (const doc of docs) {
            const query = {
                _id: doc._id
            }
            const update = {
                $set: {
                    status: "shipped"
                }
            }
            await collection.updateOne(query, update);
        }
    }

    async getShipment(fields) {
        let requiredFields = Object.assign({}, fields);
        delete requiredFields.type;
        const collection = this.db.collection(WMSDatabaseApis._collection.shipment);
        let shipmentRecordsByReqFields = await collection.aggregate(GET_SHIPMENT_BY_COMPOUND_FILTER(requiredFields)).toArray();
        return shipmentRecordsByReqFields;
    }

    async getInventoryReceive(fields) {
        let requiredFields = Object.assign({}, fields);
        delete requiredFields.type;
        const collection = this.db.collection(WMSDatabaseApis._collection.inventoryReceive);
        let invRecRecords = await collection.aggregate(GET_INVENTORY_RECEIVED_BY_COMPOUND_FILTER).toArray();
        return invRecRecords;
    }
}

export class GsheetApis extends GenerateGSheetApis {
    static _forUploadSpreadSheet = {
        spreadsheetId: "14lDiRT1Hfwfd63wvPBXoJGluXs66LejPO9nMYCc-Jok",
        range: "forUpload!A:F",
        order: {
            _id: undefined,
            mdfTmEst: undefined,
            orgNm: undefined,
            UPC: undefined,
            trNo: undefined,
            qty: undefined
        }
    }
    static _needToShipSpreadSheet = {
        spreadsheetId: "1Pgk6x0Dflq6FwMLk2qIyU9QgHH8RZNneYWLWMk3J2qM",
        ranges: ["needtoship!I:I", "needtoship!J:J", "needtoship!AV:AV", "needtoship!AD:AD", "needtoship!AE:AF", "needtoship!AG:AH", "needtoship!AI:AJ", "needtoship!AK:AL"],
        order: {
            amzOrderId: undefined,
            tracking: undefined,
            upc1: undefined,
            bundleUpc1: undefined,
            bundleUpc2: undefined,
            bundleUpc3: undefined,
            RMAUpc: undefined
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

    async readSheet(spreadsheetId, range) {
        const spreadSheet = await this._getSpreadSheet();
        let response = (await spreadSheet.values.get({
            spreadsheetId, range
        })).data;
        return response;
    }
    async batchReadSheet(spreadSheetDetail) {
        const { spreadsheetId, ranges } = spreadSheetDetail;
        const spreadSheet = await this._getSpreadSheet();
        let response = (await spreadSheet.values.batchGet({
            spreadsheetId,
            ranges,
            majorDimension: "ROWS"
        })).data
        return response
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

//-----------------------------------------Belows will be deprecated ---------------------------
//@desc below util functions are included in @OpenApi,and will be deprecated.
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