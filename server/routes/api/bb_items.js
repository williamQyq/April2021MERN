const express = require('express');
const router = express.Router();

//Item Model
const ItemBB = require('../../models/BBItem');
// @route GET api/items
router.get('/', (req, res) => {
    ItemBB.aggregate([
        {
            $project: {
                key:"$_id",
                link: 1,
                name: 1,
                sku: 1,
                qty: 1,
                upc: 1,
                currentPrice: {
                    $arrayElemAt: [
                        "$price_timestamps.price", -1
                    ]
                },
                IsCurrentPriceLower: {
                    $lt: [
                        {
                            $arrayElemAt: [
                                "$price_timestamps.price", -1
                            ]
                        },
                        {
                            $arrayElemAt: [
                                "$price_timestamps.price", -2
                            ]
                        }
                    ]
                },
                captureDate: {
                    $arrayElemAt: [
                        "$price_timestamps.date", -1
                    ]
                },
            }
        },
        {
            $sort:{
                captureDate:-1
            }
        }
    ])
        .then(items => {
            res.json(items)
        });

});


router.post('/push_price/:_id', (req, res) => {
    Item.findByIdAndUpdate(req.params._id, {
        $push: {
            price_timestamps: {
                price: req.body.currentPrice
            }
        }
    }, { useFindAndModify: false }).then(item => res.json({ success: true }));
});


module.exports = router;