const express = require('express');
const router = express.Router();

//Item Model
const ItemBB = require('../../models/BBItem');
// @route GET api/items
router.get('/', (req, res) => {

    ItemBB.find({}, {
        key:"$_id",
        link:"$link",
        name:"$name",
        upc:"$upc",
        qty:"$qty",
        createdDate:"$created_date",
        currentPrice:"$price_timestamps.price",
        priceTimestamps: { $slice: -1 },
        IsCurrentPriceLower: {
            $lt: [
                "$price",
                {
                    $arrayElemAt: [
                        "$price_timestamps.price", -1
                    ]
                }
            ]
        }
    })
    .sort({created_date: -1})
    .then(items => {
        res.json(items)
    });
    // ItemBB.aggregate([
    //     {
    //         $project: {
    //             link: 1,
    //             name: 1,
    //             sku: 1,
    //             PreviousPrice: {
    //                 $arrayElemAt: [
    //                     "$price_timestamps.price", -1
    //                 ]
    //             },
    //             IsCurrentPriceChanged: {
    //                 $ne: [
    //                     item.currentPrice,
    //                     {
    //                         $arrayElemAt: [
    //                             "$price_timestamps.price",
    //                             -1 // depends on prices stored by pushing to the end of history array.
    //                         ]
    //                     }
    //                 ]
    //             }
    //         },
    //     },
    //     {
    //         $match: {
    //             sku: item.sku,
    //             IsCurrentPriceChanged: true
    //         }
    //     }
    // ])
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