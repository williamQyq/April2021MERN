const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wmsDatabase.js');
//@route GET api/wms
router.get('/', (req, res) => {
    const { upc } = req.query;
    const collection = wms.getDatabase().collection('sellerInv')
    collection.find({ '_id.UPC': upc, '_id.org': "M" })
        .toArray()
        .then(doc => {
            console.log(`doc=======`,doc)
            res.json(doc.qty)
        })
});

module.exports = router;