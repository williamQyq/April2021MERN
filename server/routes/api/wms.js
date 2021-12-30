const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wmsDatabase.js');
//@route GET api/wms
router.get('/', (req, res) => {
    const { upc } = req.body;
    res.json(upc)
    const collection = wms.getDatabase().collection('sellerInv')
    collection.find({ '_id.UPC': upc, '_id.org': "M" })
        .toArray()
        .then(doc => {
            res.json(doc.qty)
        })
});

module.exports = router;