const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wms/wmsDatabase.js');
//@route GET api/wms
router.get('/quantity', (req, res) => {
    const { upc } = req.query;
    const collection = wms.getDatabase().collection('sellerInv')
    collection.findOne({ '_id.UPC': upc, '_id.org': "M" })
        .then(doc => {
            res.json(doc.qty)
        })
});

module.exports = router;