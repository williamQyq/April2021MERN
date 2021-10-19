const express = require('express');
const router = express.Router();


const ItemBB = require('../../models/BBItem.js'); //Item Model
const { getCurPrice,
    getPrevPrice,
    getPriceDiff,
    getPriceCaptureDate,
    sortOnPriceCaptureDate } = require('../../query/aggregate.js')

// @route GET api/items
router.get('/', (req, res) => {
    ItemBB.aggregate([
        {
            $project: {
                key: "$_id",
                link: 1,
                name: 1,
                sku: 1,
                qty: 1,
                upc: 1,
                currentPrice: getCurPrice,
                isCurrentPriceLower: {
                    $lt: [getCurPrice, getPrevPrice]
                },
                priceDiff: getPriceDiff,
                captureDate: getPriceCaptureDate
            }
        },
        sortOnPriceCaptureDate
    ])
        .then(items => {
            res.json(items)
        });

});


router.post('/push_price/:_id', (req, res) => {
    ItemBB.findByIdAndUpdate(req.params._id, {
        $push: {
            price_timestamps: {
                price: req.body.currentPrice
            }
        }
    }, { useFindAndModify: false }).then(item => res.json({ success: true }));
});

router.get('/detail/:_id', (req, res) => {
    ItemBB.findById(req.params._id)
        .then(itemDetail => res.json(itemDetail));
});


module.exports = router;