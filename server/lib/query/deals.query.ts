import mongoose from 'mongoose';
import ItemSpec from '#models/Specification.model';
import BestbuyDeal from "#models/Bestbuy.model";
import MicrosoftDeal from "lib/models/Micros.model";

import {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
    UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
    LOOKUP_ITEM_SPEC,
    LAST_PRICE,
} from './aggregate.js';
import { BestbuyDealDoc, MicrosoftDealDoc } from 'lib/models/interface.d';

export class Deals {
    static _ItemSpec: mongoose.Model<Document> = ItemSpec;
    static _BestbuyDeal: mongoose.Model<BestbuyDealDoc> = BestbuyDeal;
    static _MicrosoftDeal: mongoose.Model<MicrosoftDealDoc> = MicrosoftDeal;

    constructor() {
        //    
    }
}

export interface DealItemSpec {
    UPC?: string;
    [key: string]: string | any
}
export interface DealDataType {
    sku?: string;
    name?: string;
    link?: string;
    currentPrice?: number;
    [key: string]: any;
}
/**
 * 
 * @description Class that handles CRUD operations for deals from BESTBUY MICORS in a database.
 */
export class DealsAlert extends Deals {
    constructor() {
        super();
    }
    /**
     * @description upsert deal item specification to database.
     * @param itemSpec 
     * @param sku 
     * @returns mongoose.Document
     */
    async upsertItemConfiguration(itemSpec: DealItemSpec, sku: string) {
        let query: mongoose.FilterQuery<unknown>;
        query = itemSpec.UPC ? { upc: itemSpec.UPC, sku } : { sku };
        const update: mongoose.UpdateQuery<unknown> = {
            $setOnInsert: {
                spec: itemSpec
            }
        }
        const option: mongoose.QueryOptions = { upsert: true, new: true, useFindAndModify: false, }

        let doc = await Deals._ItemSpec.findOneAndUpdate(query, update, option).exec();
        return doc;
    }

    /**
     * @description find item specification on sku.
     * @param sku 
     * @returns mongoose.Document
     */
    async findItemSpecOnSku(sku: string) {
        let doc = await ItemSpec.findOne({ sku }).exec();
        return doc;
    }

    /**
     * @description create and save deal info to database.
     * @param deal deal item info
     * @param model mongoose.model
     * @returns message string "UPDATED PRICE" | "PRICE NOT CHANGED" | "NEW ITEM UPSERT"
     */
    async createDeal(deal: DealDataType, model: mongoose.Model<unknown>) {
        let msg: string | undefined = undefined;
        let isUpserted: boolean = await this.insertDealItem(deal, model)    //insert if no document

        if (!isUpserted) {
            //push updated price to priceTimestamps field
            let isPricedPushed = await this.updateDealOnPriceChanged(deal, model);
            msg = isPricedPushed ? "UPDATED PRICE" : "PRICE NOT CHANGED"
        } else {
            msg = "NEW ITEM UPSERT"
        }

        return msg

    }
    async insertDealItem(deal: DealDataType, model: mongoose.Model<unknown>) {
        const query: mongoose.FilterQuery<unknown> = { sku: deal.sku };
        const update: mongoose.UpdateQuery<unknown> = {
            $setOnInsert: {
                sku: deal.sku,
                name: deal.name,
                link: deal.link,
                price_timestamps: [{
                    price: deal.currentPrice
                }]
            }
        };
        const options: mongoose.QueryOptions = { upsert: true };

        let isUpserted: boolean = await model.updateOne(query, update, options).exec()
            .then((result: mongoose.UpdateWriteOpResult) =>
                result.upsertedId ? true : false
            )

        return isUpserted
    }

    async updateDealOnPriceChanged(deal: DealDataType, model: mongoose.Model<unknown>) {
        const { sku, currentPrice } = deal;

        let priceChangedDeals = await model.aggregate([{
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
        }, {
            $match: {
                sku,
                isPriceChanged: true
            }
        }]).exec();

        // No update deals. End.
        if (priceChangedDeals.length === 0) return false;

        return await Promise.all(priceChangedDeals.map(alteredDeal =>
            this.insertAlteredDealPrice(alteredDeal, deal, model)
        ))
    }

    /**
     * @description push and update new altered deal price.
     * @param alteredDeal 
     * @param deal 
     * @param model 
     * @returns 
     */
    async insertAlteredDealPrice(alteredDeal: DealDataType, deal: DealDataType, model: mongoose.Model<unknown>) {
        let options: mongoose.QueryOptions = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
        let update: mongoose.UpdateQuery<unknown> = {
            $push: {
                price_timestamps: {
                    price: deal.currentPrice
                }
            }
        }

        let newDeal = await model.findByIdAndUpdate(alteredDeal._id, update, options).exec();

        return newDeal;
    }

    async getDeals(model: mongoose.Model<BestbuyDealDoc | MicrosoftDealDoc>) {

        let deals: DealDataType[] = await model.aggregate([
            LOOKUP_ITEM_SPEC,
            UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
            PROJ_ITEM,
            SORT_ON_CAPTURE_DATE as {
                $sort: {
                    captureDate: -1;
                };
            },
        ]).exec();
        return deals;
    }

    async getDealById(model: mongoose.Model<BestbuyDealDoc | MicrosoftDealDoc>, _id: mongoose.ObjectId) {
        let deals = await model.aggregate([
            PROJ_ITEM_DETAIL,
            {
                $match: {
                    _id
                }
            }
        ]).exec();

        return deals[0];

    }
}

// //-----------------------------------------Belows will be deprecated ---------------------------
// //@desc below util functions are included in @OpenApi,and will be deprecated.
// //@itemSpec
// export const saveItemConfiguration = async (config, sku) => {

//     const query = { upc: config.UPC, sku: sku }
//     const update = {
//         $setOnInsert: {
//             spec: config
//         }
//     }
//     const option = { upsert: true, new: true, useFindAndModify: false, }
//     let doc = await ItemSpec.findOneAndUpdate(query, update, option)
//     return doc;
// }
// //@itemSpec
// export const findItemConfigDocumentOnSku = async (sku) => {
//     let doc = await ItemSpec.findOne({ sku: sku })
//     return doc;
// }
// //@StoreListings -----------------------------
// export const saveStoreItemToDatabase = async (item, storeModel) => {
//     let msg = '';
//     let isUpserted = await setOnInsert(item, storeModel)    //insert if no document

//     if (!isUpserted) {
//         //push updated price to priceTimestamps field
//         let isPricedPushed = await updateItemIfPriceChanged(item, storeModel)
//         msg = isPricedPushed ? "UPDATED PRICE" : "PRICE NOT CHANGED"
//     }
//     else {
//         msg = "NEW ITEM UPSERT"
//     }

//     return msg

// }

// export const setOnInsert = async (item, storeModel) => {
//     const query = { sku: item.sku };
//     const update = {
//         $setOnInsert: {
//             sku: item.sku,
//             name: item.name,
//             link: item.link,
//             price_timestamps: [{
//                 price: item.currentPrice
//             }]
//         }
//     };
//     const options = { upsert: true };
//     let isUpserted = await storeModel.updateOne(query, update, options)
//         .then(result => result.upserted ? true : false)

//     return isUpserted
// }

// //updateItemIfPriceChanged(item:Item, storeModel:Mongoose<model>)-> enum<true|false>isItemPriceChanged
// export const updateItemIfPriceChanged = (item, storeModel) => {
//     return storeModel.aggregate([
//         {
//             $project: {
//                 sku: 1,
//                 updatePrice: item.currentPrice,
//                 isPriceChanged: {        //check if capture price equal current price in db.
//                     $ne: [
//                         item.currentPrice,       //lastest price from scrape
//                         LAST_PRICE             //price in db
//                     ]
//                 }
//             }
//         },
//         {
//             $match: {
//                 sku: item.sku,
//                 isPriceChanged: true
//             }
//         }
//     ]).then(async (docs) => {
//         if (docs.length == 0)
//             return false

//         await Promise.all(docs.map(doc => pushUpdatedPrice(doc, item, storeModel)))
//         return true
//     })
// }

// export const pushUpdatedPrice = (doc, item, storeModel) => {
//     let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false }
//     let update = {
//         $push: {
//             price_timestamps: {
//                 price: item.currentPrice
//             }
//         }
//     }

//     return storeModel.findByIdAndUpdate(doc._id, update, options)

// }
// //----------------------------

// //@StoreListings
// export const getStoreItems = (Model) => (
//     Model.aggregate([
//         LOOKUP_ITEM_SPEC,
//         UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
//         PROJ_ITEM,
//         SORT_ON_CAPTURE_DATE,

//     ])
// )
// //@StoreListings
// export const getStoreItemDetailById = (Model, _id) => (
//     Model.aggregate([
//         PROJ_ITEM_DETAIL,
//         {
//             $match: {
//                 _id: ObjectId(_id)
//             }
//         }
//     ])
// )
// //@AmzProdPricing
// export const findAllProdPricing = () => {
//     let query = {
//         "upc": { $exists: true },
//         "identifiers": { $exists: true }
//     }
//     return AmzProdPricing.find(query)
// }
// //@AmzProdPricing
// export const findProdPricingOnUpc = (upc) => {
//     return AmzProdPricing.find({ upc: upc })
// }
// //@AmzProdPricing
// export const updateProdPricingOffer = (upc, asin, offers) => {
//     const filter = { "upc": upc, "identifiers.asin": asin }
//     const update = { $set: { "identifiers.$.offers": offers } }
//     const option = { useFindAndModify: false }
//     return AmzProdPricing.findOneAndUpdate(filter, update, option)

// }
// //@AmzProdPricing
// export const upsertProdPricingNewAsin = (upc, asin) => {
//     let newIdentifier = new AmzIdentifier({ asin })
//     let newProd = new AmzProdPricing({ upc, identifiers: new Array() })

//     let query = { "upc": upc }
//     let update = { $setOnInsert: { newProd } }
//     let option = { upsert: true, new: true, useFindAndModify: false };
//     return AmzProdPricing.updateOne(query, update, option)  //set on insert for new upc
//         .then(() => {
//             let query = { "upc": upc }
//             let update = { $pull: { "identifiers": { "asin": asin } } }
//             return AmzProdPricing.updateOne(query, update)
//         })
//         .then(() => {
//             let query = { "upc": upc }
//             let update = { $push: { identifiers: newIdentifier } }
//             return AmzProdPricing.updateOne(query, update)
//         })

// }