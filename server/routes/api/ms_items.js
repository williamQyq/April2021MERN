import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

import ItemMS from '../../models/MsItem.js'; //Item Model
import {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE
} from '../../query/aggregate.js';

// @route GET api/items
router.get('/', (req, res) => {
    ItemMS.aggregate([
        PROJ_ITEM,
        SORT_ON_CAPTURE_DATE
    ])
        .then(items => {
            res.json(items)
        });

});

router.get('/detail/:_id', (req, res) => {
    ItemMS.aggregate([
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

// router.post('/push_price/:_id', (req, res) => {
//     ItemMS.findByIdAndUpdate(req.params._id, {
//         $push: {
//             price_timestamps: {
//                 price: req.body.currentPrice
//             }
//         }
//     }, { useFindAndModify: false }).then(item => res.json({ success: true }));
// });

export default router;