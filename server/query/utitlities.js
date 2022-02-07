const { BBItem } = require('../models/BBItem.js')
const { MsItem } = require('../models/MsItem.js')
const { ItemSpec } = require('../models/Spec.js')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
} = require('./aggregate.js')

const saveItemConfiguration = async (config) => {

    const query = { upc: config.UPC, sku: config.sku }
    const update = {
        $setOnInsert: {
            spec: config
        }
    }
    const option = { upsert: true, useFindAndModify: false }
    await ItemSpec.findOneAndUpdate(query, update, option)
}

const isItemConfigFound = async (sku) => {
    const res = await ItemSpec.findOne({ sku: sku })
    return res ? true : false
}
const getStoreItems = (Model) => (
    Model.aggregate([
        {
            $lookup: {
                from: "itemSpec",
                localField: "sku",
                foreignField: "sku",
                as: "item_spec"
            }
        },
        {
            $unwind: "$item_spec"
        },
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

module.exports = {
    saveItemConfiguration,
    isItemConfigFound,
    getStoreItems,
    getStoreItemDetailById,
}