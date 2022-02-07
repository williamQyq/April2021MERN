const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { Bestbuy } = require('../../script_packages/scripts.js');
const Item = require('../../models/BBItem.js'); //Item Model

const {
    getItemConfiguration,
} = require('../../script_packages/scraper.js');
const util = require('../../query/utitlities.js');


const {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
} = require('../../query/aggregate.js')

// @route GET api/items
router.get('/', (req, res) => {
    Item.aggregate([
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE
    ])
        .then(items => res.json(items));

});

router.get('/detail/:_id', (req, res) => {
    Item.aggregate([
        PROJ_ITEM_DETAIL,
        {
            $match: {
                _id: ObjectId(req.params._id)
            }
        }
    ])
        .then(items => {
            res.json(items)
        });
});

router.post('/itemSpec/add', async (req, res) => {
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy(Item)
    let isConfigFound = await util.isItemConfigFound(sku)
    if (!isConfigFound) {
        getItemConfiguration(bestbuy, link).then(config => {
            console.log(`[${config.UPC}] Get item config request finished.`)
            config.sku = sku;
            util.saveItemConfiguration(config)
                .then(() => res.json({
                    status: "success",
                    msg: "Upsert item config finished.",
                    id: config.UPC
                }));
        })
    } else {
        console.log('[itemSpec add req]Item config already exists.')
        res.json({
            status: "warning",
            msg: "Item config already exists.",
            id: sku
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