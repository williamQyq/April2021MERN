import express from 'express';
const router = express.Router();
import auth from '#middleware/auth.js';
import wms from '#wms/wmsDatabase.js';
import { WMSDatabaseApis, GsheetApis } from '../../query/utilities.js';
import excel from 'exceljs';

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
        .catch(err => { res.status(500).json({ msg: "Fail to get Inventory Received" }) })
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

router.get('/shipment/getNeedToShipItems/limit/:docLimit/skip/:docSkip', auth, (req, res) => {
    const { docLimit, docSkip } = req.params;
    let wms = new WMSDatabaseApis();
    wms.getNeedToShipFromShipment(Number(docLimit), Number(docSkip))// params in req are strings, mongodb limit query accepts number only
        .then(needToShipItems => {
            wms.countNeedToShipFromShipment()
                .then((totalShipmentCount) => res.json({ shipment: needToShipItems, totalShipmentCount }))
        })
        .catch((err => {
            res.status(500).json({ msg: "Fail to get Shipment" })
        }))
})
router.get('/shipment/getPendingAndTotal/:orgNm', auth, (req, res) => {
    const { orgNm } = req.params;
    let wms = new WMSDatabaseApis();
    wms.getPendingShipmentInfoByOrgNm(orgNm)
        .then((pendingInfo) => {
            if (pendingInfo.total > 0) {
                const { pending, total } = pendingInfo;
                res.json({ pending, total })
            } else {
                res.json({ pending: -1, total: -1 })    //no shipment by today
            }
        })
})

router.post('/inventoryReceive/updateRecOnTracking', auth, (req, res) => {
    const { uploadFile } = req.body;
    updateRecOnTracking(uploadFile)
        .then((response) => {
            let unfulfilled = response.filter(actionRes => (actionRes.status !== "fulfilled"))
            if (unfulfilled.length > 0) {
                res.json({ msg: 'Some records are rejected', rejected: unfulfilled })
            } else {
                res.json({ msg: 'Sucess, All records are updated.' })
            }

        })
        .catch(e => {
            res.status(400).json({ msg: `Upload File contains Invalid Input\n\n${e}` })
        })
})

const updateRecOnTracking = async (file) => {
    let api = new WMSDatabaseApis();
    let titles = file.shift();
    let colTitleIndexMap = new Map()
    titles.forEach((colTitle, index) => {
        colTitleIndexMap.set(colTitle, index);
    })

    return Promise.allSettled(file.map(row => {
        let tracking = row[colTitleIndexMap.get('Tracking')];
        let orgNm = row[colTitleIndexMap.get('OrgNm')];
        if (tracking && orgNm)
            // console.log(tracking, orgNm)
            return api.updateInventoryReceiveOrgNmOnTracking(tracking, orgNm);
    }))
}

router.get('/downloadSampleXlsx/inventoryReceive', (req, res) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Inventory Received");
    worksheet.columns = [
        { header: "Tracking", key: "tracking", width: 25 },
        { header: "OrgNm", key: "orgNm", width: 5 }
    ];
    let rows = [];
    rows.push({
        tracking: "",
        orgNm: ""
    })
    worksheet.addRows(rows);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "sample.xlsx"
    );
    return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
})

router.get('/needToShip/syncGsheet', auth, (req, res) => {
    let gsheet = new GsheetApis();

    gsheet.batchReadSheet(GsheetApis._needToShipSpreadSheet).then((res) => {
        console.log(res.valueRanges[0].values)
    })

    res.json({ msg: "success" })
})

router.get('/shipment/getNotVerifiedShipment/dateMin/:dateMin/dateMax/:dateMax', auth, (req, res) => {
    const { dateMin, dateMax } = req.params;
    let wms = new WMSDatabaseApis();
    wms.getShippedNotVerifiedShipment(Number(dateMin), Number(dateMax))
        .then(unsubstantiatedShipment => {
            console.log(unsubstantiatedShipment)
            res.json(unsubstantiatedShipment)
        })
        .catch(err => {
            res.status(500).json({ msg: `Unable to get unsubstantiated Shipment\n\n${err}` })
        })
})

export default router;