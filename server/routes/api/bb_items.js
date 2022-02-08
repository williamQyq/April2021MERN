const express = require('express');
const router = express.Router();
const { Bestbuy } = require('../../script_packages/scripts.js');
const Model = require('../../models/BBItem.js'); //Item Model
const { getItemConfiguration } = require('../../script_packages/scraper.js');
const util = require('../../query/utitlities.js');

// @route GET api/items
router.get('/', (req, res) => {
    util.getStoreItems(Model)
        .then(items => res.json(items));

});

router.get('/detail/:_id', (req, res) => {
    util.getStoreItemDetailById(Model, req.params._id)
        .then(items => {
            res.json(items)
        });
});

router.put('/itemSpec/add', async (req, res) => {
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy(Model)

    let doc = await util.isItemConfigFound(sku)
    if (!doc) {
        let item = await getItemConfiguration(bestbuy, link)
        console.log(`[${item.UPC}] Get item config request finished.`)
        util.saveItemConfiguration(item, sku).then(() =>
            res.json({
                status: "success",
                msg: "Upsert item config finished.",
                id: item.UPC
            }))
    } else {
        console.log(`[itemSpec add req]Item config already exists: ${doc.upc}.`)
        res.json({
            status: "warning",
            msg: "Item config already exists.",
            id: doc.upc
        })
    }

})

// //@route ***currently not used***
// router.post('/push_price/:_id', (req, res) => {
//     ItemBB.findByIdAndUpdate(req.params._id, {
//         $push: {
//             price_timestamps: {
//                 price: req.body.currentPrice
//             }
//         }
//     }, { useFindAndModify: false }).then(item => res.json({ success: true }));
// });

module.exports = router;