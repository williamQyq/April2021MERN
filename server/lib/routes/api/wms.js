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

router.post('/quantity/all', auth, (req, res) => {
    const { upcArr } = req.body;
    let upcWmsQtyMap = [];

    const collection = wms.getDatabase().collection('sellerInv')
    collection.find({ '_id.UPC': { $in: upcArr }, '_id.org': "M" }).toArray()
        .then(doc => {
            doc.forEach(doc => {
                upcWmsQtyMap.push([doc._id.UPC, doc.qty])
            })
            res.json(upcWmsQtyMap)
        })
        .catch(err => {
            res.status(502).json({ msg: "WMS connection error" })
        })

})

router.post('/sellerInv/subtractQty', auth, (req, res) => {
    const file = req.body;

    const collection = wms.getDatabase().collection('')
})

export default router;