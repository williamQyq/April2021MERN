import express from 'express';
const router = express.Router();
import auth from '#middleware/auth.js';
import wms from '#wms/wmsDatabase.js';
//@route GET api/wms
router.get('/quantity/:upc', (req, res) => {
    let upc = req.params.upc;
    const collection = wms.getDatabase().collection('sellerInv')
    collection.findOne({ '_id.UPC': upc, '_id.org': "M" })
        .then(doc => {
            res.json(doc.qty)
        })
});

router.post('/quantity/all', async (req, res) => {
    const { upcs } = req.body;
    let quantityMapArray = []

    const collection = wms.getDatabase().collection('sellerInv')
    await collection.find({ '_id.UPC': { $in: upcs }, '_id.org': "M" }).forEach(doc => {
        quantityMapArray.push([doc._id.UPC, doc.qty])
    })

    res.json(quantityMapArray)

})

export default router;