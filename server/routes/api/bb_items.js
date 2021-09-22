const express = require('express');
const router = express.Router();

//Item Model
const ItemBB = require('../../models/BBItem');
// @route GET api/items
router.get('/', (req, res) => {
    // ItemBB.aggregate([
    //     {
    //         $project: {
    //             price: "$price_timestamps.price",    
    //             price_timestamps:{
    //                 $slice: ["$price_timestamps", -1],
    //             }
    //         }
    //     }
    // ]).then(items => {
    //     res.json(items);
    // })

    ItemBB.find({}, {
        key:"$_id",
        name:"$name",
        upc:"$upc",
        qty:"$qty",
        created_date:"$created_date",
        price:"$price_timestamps.price",
        price_timestamps: { $slice: -1 },
     
    }).then(items => {
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