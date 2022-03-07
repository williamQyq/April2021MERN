const express = require('express');
const router = express.Router();
const Bestbuy = require('../../script_packages/BB');
const Model = require('../../models/BBItem.js'); //Item Model
const { getItemConfiguration } = require('../../script_packages/scraper.js');
const { saveItemConfiguration, getStoreItemDetailById, getStoreItems, findItemConfig } = require('../../query/utitlities.js');

// @route GET api/items
router.get('/', (req, res) => {
    getStoreItems(Model)
        .then(items => res.json(items));

});

// @route GET api/items
router.get('/detail/:_id', (req, res) => {
    getStoreItemDetailById(Model, req.params._id)
        .then(items => {
            res.json(items)
        });
});

router.put('/itemSpec/add', async (req, res) => {
    let message;
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy()

    let doc = await findItemConfig(sku)
    if (!doc) {
        try {
            let item = await getItemConfiguration(bestbuy, link)
            console.log(`[${item.UPC}] Get item config request finished.`)

            await saveItemConfiguration(item, sku)
            message = {
                status: "success",
                msg: "Upsert item config finished.",
                id: item.UPC
            }
        } catch (e) {
            message = {
                status: "error",
                msg: "Get item spec failed.",
                id: null
            }
            console.error(`[getItemConfig] Get item config error ${sku}`)
        }
    } else {
        console.log(`[itemSpec add req]Item config already exists: ${doc.upc}.`)
        message = {
            status: "warning",
            msg: "Item config already exists.",
            id: doc.upc
        }
    }

    res.json(message)
})

module.exports = router;