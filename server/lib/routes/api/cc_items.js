import express from 'express';
import ItemCC from '#models/CCItem';
const router = express.Router();

// @route GET api/items
router.get('/', (req, res) => {

    ItemCC.find({}, {
        key: "$_id",
        name: "$name",
        upc: "$upc",
        qty: "$qty",
        created_date: "$created_date",
        price: "$price_timestamps.price",
        price_date: "$price_timestamps.date",
        price_timestamps: { $slice: -1 },

    }).then(items => {
        res.json(items)
    });
});


router.post('/push_price/:_id', (req, res) => {
    ItemCC.findByIdAndUpdate(req.params._id, {
        $push: {
            price_timestamps: {
                price: req.body.currentPrice
            }
        }
    }, { useFindAndModify: false }).then(item => res.json({ success: true }));
});


export default router;