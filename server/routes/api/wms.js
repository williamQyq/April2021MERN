const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wmsDatabase.js');
//@route GET api/wms
router.get('/', (req, res) => {
    const collection = wms.getDatabase().collection('sellerInv')
    collection.find({ '_id.UPC': "195553073813", '_id.org': "M" })
        .toArray()
        .then(docs => {
            res.json(docs);
        })

});

module.exports = router;