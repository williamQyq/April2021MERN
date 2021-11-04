const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
//Item Model

// @route GET api/items
router.get('/', (req, res) => {
    console.log(`keepa routes : ${JSON.stringify(req.query)}`);
    res.json("keepa");
});

// // @route POST api/items
// router.post('/', (req, res) => {
//     const newItem = new Item({
//         link: req.body.link,
//         name: req.body.name,
//         price_timestamps: req.body.price_timestamps
//     })

//     newItem.save().then(item => res.json(item));
// });

// // @route DELETE api/items
// router.delete('/:id', (req, res) => {
//     Item.findById(req.params.id)
//         .then(item => item.remove().then(() => res.json({ success: true })))
//         .catch(err => res.status(404).json({ success: false }));
// });

// // @route POST api/push_price/:_id
// // @desc push price into database on _id
// router.post('/push_price/:_id', auth, (req, res) => {
//     Item.findByIdAndUpdate(req.params._id, {
//         $push: {
//             price_timestamps: {
//                 price: req.body.currentPrice
//             }
//         }
//     }, { useFindAndModify: false }).then(item => res.json({ success: true }));
// });


module.exports = router;