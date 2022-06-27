import express from 'express';
const router = express.Router();
import auth from '#middleware/auth.js';
import wms from '#wms/wmsDatabase.js';
import { WMSDatabaseApis, GsheetApis } from '../../query/utilities.js';


//@route GET api/wms
//@desc get warehouse quantity on upc
router.get('/quantity/:upc', (req, res) => {
    let upc = req.params.upc;
    const collection = wms.getDatabase().collection('sellerInv')
    collection.findOne({ '_id.UPC': upc, '_id.org': "M" })
        .then(doc => {
            res.json(doc.qty)
        })
});

//@route POST api/wms
//@desc get warehouse quantity on multiple upcs
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

//@route POST api/wms
//@desc update warehouse quantity on multiple upcs
//@availability false
router.post('/sellerInv/subtractQty', auth, (req, res) => {

    res.status(503).json({ msg: "Update WMS Service Unavailable" })
})

router.get('/inventoryReceivedItems', auth, (req, res) => {
    let wms = new WMSDatabaseApis();
    wms.getInventoryReceive()
        .then(receivedItems => { res.json(receivedItems) })
        .catch(err => {
            res.status(500).json({ msg: "Fail to get Inventory Received" })
        })
})

//@route get api/wms
//@desc sync warehouse inventory Received with ForUpload Gsheet
router.get('/inventoryReceived/syncGsheet', auth, (req, res) => {
    let wms = new WMSDatabaseApis();
    let gsheet = new GsheetApis();

    wms.getInventoryReceive()
        .then(receivedItems => gsheet.createArrayOfArrayFromDocumentsInOrder(GsheetApis._forUploadSpreadSheet, receivedItems))
        .then(values => gsheet.updateSheet(GsheetApis._forUploadSpreadSheet, values))
        .then(() => { res.json("success") })
        .catch(err => {
            res.status(500).json({ msg: "Fail to get Inventory Received or Update Gsheet" })
        })

})

router.get('/getNeedToShipItems', auth, (req, res) => {
    let wms = new WMSDatabaseApis();
    wms.getNeedToshipFromShipment()
        .then(needToshipItems => { res.json(needToshipItems) })
        .catch((err => {
            res.status(500).json({ msg: "Fail to get Shipment" })
        }))
})



export default router;