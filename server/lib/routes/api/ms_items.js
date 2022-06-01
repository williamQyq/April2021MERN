import express from 'express';
import mongoose from 'mongoose';
import ItemMS from '#models/MsItem.js'; //Item Model
import {
    PROJ_ITEM,
    PROJ_ITEM_DETAIL,
    SORT_ON_CAPTURE_DATE
} from '#query/aggregate.js';
import auth from '#middleware/auth.js';
import { getMicrosoftLaptops } from '#bin/scraper.js';

const ObjectId = mongoose.Types.ObjectId;
const router = express.Router();

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

router.get('/onlinePrice', auth, (req, res) => {
    getMicrosoftLaptops()
        .then(() => res.json("success"))
        .catch(err => res.status(500).json({ msg: "Fail to retrive Microsoft Laptop Price " }))
})

export default router;