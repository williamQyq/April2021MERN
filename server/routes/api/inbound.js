const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const wms = require('../../wms/wmsDatabase.js');
const { outputGsheet } = require('../../script_packages/gsheet/gsheet');
//@route GET api/wms
router.get('/inv-receive/wrongadds', (req, res) => {
    const collection = wms.getDatabase().collection('inventoryReceive')
    collection.find({ 'orgNm': 'wrongadds' }).toArray()
        .then(docs => {
            console.log(`[routes] receive inventoryReceive wrongadds GET request...`)
            res.json(docs)
            return docs;
        }).then(docs => {
            outputGsheet(docs)
        })
});

module.exports = router;