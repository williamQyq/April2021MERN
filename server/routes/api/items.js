const express = require('express');
const router = express.Router();

//Item Model
const Item = require('../../models/Item');

// @route GET api/items
router.get('/', (req, res) => {
    Item.find()
        .sort({date: -1})
        .then(items => res.json(items));
});

// @route POST api/items
router.post('/', (req, res) => {
    const newItem = new Item({
        link: req.body.link,
        name: req.body.name,
        price: req.body.price
    })

    newItem.save().then(item => res.json(item));
});

// @route delete api/items
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(()=> res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});


module.exports = router;