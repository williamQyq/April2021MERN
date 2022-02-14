const express = require('express');
const router = express.Router();
const { Bestbuy } = require('../../script_packages/scripts.js');
const Model = require('../../models/BBItem.js'); //Item Model
const { getItemConfiguration } = require('../../script_packages/scraper.js');
const { saveItemConfiguration, getStoreItemDetailById, getStoreItems } = require('../../query/utitlities.js');

// @route GET api/items
router.get('/', (req, res) => {
    getStoreItems(Model)
        .then(items => res.json(items));

});

router.get('/detail/:_id', (req, res) => {
    getStoreItemDetailById(Model, req.params._id)
        .then(items => {
            res.json(items)
        });
});

router.put('/itemSpec/add', async (req, res) => {
    let message;
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy(Model)

    let doc = await findItemConfig(sku)
    if (!doc) {
        let item = await getItemConfiguration(bestbuy, link)
        console.log(`[${item.UPC}] Get item config request finished.`)
        try {
            await saveItemConfiguration(item, sku)
            message = {
                status: "success",
                msg: "Upsert item config finished.",
                id: item.UPC
            }
        } catch (e) {
            console.error(e)
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