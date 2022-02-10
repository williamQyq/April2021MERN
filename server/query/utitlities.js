const { BBItem } = require('../models/BBItem.js')
const { MsItem } = require('../models/MsItem.js')
const { ItemSpec } = require('../models/Spec.js')
const { ProdPricing } = require('../models/Amz.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
    UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
    LOOKUP_ITEM_SPEC,
} = require('./aggregate.js')

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

const findItemConfig = async (sku) => {
    const res = await ItemSpec.findOne({ sku: sku })
    return res ? res : false
}
const getStoreItems = (Model) => (
    Model.aggregate([
        LOOKUP_ITEM_SPEC,
        UNWIND_ITEM_SPEC_AND_PRESERVE_ORIGIN,
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE,

    ])
)
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
const findAllProdPricing = () => {
    return ProdPricing.find({})
}

const findProdPricingOnUpc = (upc) => {
    return ProdPricing.find({ upc: upc })
}

const setProdPricingOffer = (identifier) => {
    const { upc, asin, offers } = identifier;
    const filter = { "upc": upc, "identifiers.asin": asin }
    const update = { $set: { "identifiers.$.offers": offers } }
    const option = { useFindAndModify: false }
    return ProdPricing.findOneAndUpdate(filter, update, option)

}

module.exports = {
    saveItemConfiguration,
    findItemConfig,
    getStoreItems,
    getStoreItemDetailById,
    findAllProdPricing,
    findProdPricingOnUpc,
    setProdPricingOffer
}