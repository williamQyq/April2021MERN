const { BBItem } = require('../models/BBItem.js')
const { MsItem } = require('../models/MsItem.js')
const { ItemSpec } = require('../models/Spec.js')
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
module.exports = {
    saveItemConfiguration,
    isItemConfigFound
}