const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const { getKeepaStat } = require('../../script_packages/keepa.js');

// @route GET api/items
router.get('/', (req, res) => {

    getKeepaStat(req.query.searchTerm).then(stat => {
        console.log(`keepa routes : ${JSON.stringify(stat)}`);
        res.json(stat);
    })
        .catch(err => {
            console.error(err);
        })

});
module.exports = router;