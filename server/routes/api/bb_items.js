const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const ItemBB = require('../../models/BBItem.js'); //Item Model
const {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE,
} = require('../../query/aggregate.js')

// @route GET api/items
router.get('/', (req, res) => {
    ItemBB.aggregate([
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE
    ])
        .then(items => res.json(items));

});

router.get('/detail/:_id', (req, res) => {
    ItemBB.aggregate([
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

router.get('/item-spec', (req, res) => {
    const { link, store } = req.query;
    console.log(link, store)
    res.json("success")
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