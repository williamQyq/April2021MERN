const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const ItemBB = require('../../models/BBItem.js'); //Item Model
const {
    getCurPrice,
    getPrevPrice,
    getPriceDiff,
    getPriceCaptureDate,
    sortOnPriceCaptureDate
} = require('../../query/aggregate.js')

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

    ItemBB.aggregate([
        {
            $project: {
                link: 1,
                name: 1,
                sku: 1,
                qty: 1,
                upc: 1,
                price_timestamps: 1,
                currentPrice: getCurPrice,
                priceDiff: getPriceDiff,
            }
        },
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

router.get('/item-spec', (req, res) => {
    const { link, store } = req.query;
    
    res.json("success")
})


module.exports = router;