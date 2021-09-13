const express = require('express');
const router = express.Router();

//Item Model
const Item = require('../../models/Item');
// @route GET api/items
router.get('/', (req, res) => {
    Item.find()
        .sort({created_date: -1})
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

// @route delete api/items
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(()=> res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

router.post('/push_price/:_id', (req, res) => {
    Item.findByIdAndUpdate(req.params._id, {
        $push: {
            price_timestamps: {
                price: req.body.currentPrice
            }
        }
    },{ useFindAndModify: false }).then(item =>res.json({success:true}));
});


module.exports = router;