import express from 'express';
import auth from '#middleware/auth.js';
import Item from '#models/WatchListItem.js';
const router = express.Router();

// @route GET api/items
router.get('/', (req, res) => {
    Item.find()
        .sort({ created_date: -1 })
        .then(items => res.json(items));
});

// @route POST api/items
router.post('/', (req, res) => {
    const newItem = new Item({
        link: req.body.link,
        name: req.body.name,
        price_timestamps: req.body.price_timestamps
    })

    newItem.save().then(item => res.json(item));
});

// @route DELETE api/items
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
});

// @route POST api/push_price/:_id
// @desc push price into database on _id
router.post('/push_price/:_id', auth, (req, res) => {
    Item.findByIdAndUpdate(req.params._id, {
        $push: {
            price_timestamps: {
                price: req.body.currentPrice
            }
        }
    }, { useFindAndModify: false }).then(item => res.json({ success: true }));
});


export default router;