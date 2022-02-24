const { BBItem } = require('../models/BBItem.js')
const { MsItem } = require('../models/MsItem.js')
const { ItemSpec } = require('../models/Spec.js')
const { AmzProdPricing, AmzIdentifier } = require('../models/Amz.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
    UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
    LOOKUP_ITEM_SPEC,
    LAST_PRICE
} = require('./aggregate.js')

//@itemSpec
const saveItemConfiguration = (config, sku) => {

    const query = { upc: config.UPC, sku: sku }
    const update = {
        $setOnInsert: {
            spec: config
        }
    }
    const option = { upsert: true, useFindAndModify: false }
    return ItemSpec.findOneAndUpdate(query, update, option)
}
//@itemSpec
const findItemConfig = async (sku) => {
    const res = await ItemSpec.findOne({ sku: sku })
    return res ? res : false
}
//@StoreListings -----------------------------
const saveStoreItemToDatabase = async (item, storeModel) => {
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

const setOnInsert = async (item, storeModel) => {
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
const updateItemIfPriceChanged = (item, storeModel) => {
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

const pushUpdatedPrice = (doc, item, storeModel) => {
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
const getStoreItems = (Model) => (
    Model.aggregate([
        LOOKUP_ITEM_SPEC,
        UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE,

    ])
)
//@StoreListings
const getStoreItemDetailById = (Model, _id) => (
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
const findAllProdPricing = () => {
    return AmzProdPricing.find({})
}
//@AmzProdPricing
const findProdPricingOnUpc = (upc) => {
    return AmzProdPricing.find({ upc: upc })
}
//@AmzProdPricing
const setProdPricingOffer = (identifier) => {
    const { upc, asin, offers } = identifier;
    const filter = { "upc": upc, "identifiers.asin": asin }
    const update = { $set: { "identifiers.$.offers": offers } }
    const option = { useFindAndModify: false }
    return AmzProdPricing.findOneAndUpdate(filter, update, option)

}
//@AmzProdPricing
const upsertProdPricingNewAsin = (record) => {
    const { upc, asin } = record;
    let newIdentifier = new AmzIdentifier({
        asin: asin,
    })
    let newProd = new AmzProdPricing({
        upc: upc,
        identifiers: []
    })

    let query = { upc: upc }
    let update = { $setOnInsert: { newProd } }
    let option = { upsert: true, new: true, useFindAndModify: false };
    return AmzProdPricing.updateOne(query, update, option)
        .then(async () => {
            let query = { "upc": upc }
            let update = { $pull: { "identifiers": { "asin": asin } } }
            await AmzProdPricing.updateOne(query, update)
        }).then(async () => {
            let query = { upc: upc }
            let update = { $push: { identifiers: newIdentifier } }
            await AmzProdPricing.updateOne(query, update)
        })

}

module.exports = {
    saveItemConfiguration,
    findItemConfig,
    getStoreItems,
    getStoreItemDetailById,
    findAllProdPricing,
    findProdPricingOnUpc,
    setProdPricingOffer,
    upsertProdPricingNewAsin,
    saveStoreItemToDatabase
}