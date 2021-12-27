const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wmsDatabase.js');
//@route GET api/wms
router.post('/', async (req, res) => {
    const reqProducts = req.body;
    const collection = wms.getDatabase().collection('sellerInv')

    
    const getData = async () => Promise.all(reqProducts.map(prod =>
        collection.find({ '_id.UPC': prod.upc, '_id.org': "M" }).toArray()
    ))
    getData().then(data => {
        res.json(data)
    })
});

module.exports = router;