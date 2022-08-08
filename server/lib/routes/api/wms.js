import express from 'express';
import auth from '#middleware/auth.js';
import { WMSDatabaseApis, GsheetApis } from '../../query/utilities.js';
import excel from 'exceljs';
import { status } from '../../query/aggregate.js';

const router = express.Router();

//@route GET api/wms
//@desc get warehouse quantity on upc
router.get('/quantity/:upc', (req, res) => {
    let upc = req.params.upc;
    let wms = new WMSDatabaseApis();
    wms.findUpcQtyOnOrg(upc)
        .then(qty => { res.json(qty) });
});

//@route POST api/wms
//@desc get warehouse quantity on multiple upcs
router.post('/quantity/all', auth, (req, res) => {
    const { upcArr } = req.body;
    let result = [];
    let wms = new WMSDatabaseApis();
    wms.findUpcQtyMultiOnOrg(upcArr)
        .then(docs => {
            docs.forEach(doc => { result.push([doc._id.UPC, doc.qty]) })   //create array of array: upc, qty array mapping
            res.json(result)
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
        if (tracking && orgNm) {
            return api.updateInventoryReceiveOrgNmOnTracking(tracking, orgNm);
        }
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
    // const { dateMin, dateMax } = req.params;
    const startDateUnix = 1659931200000;    //2022-08-08 00:00:00 since then, get all unsubstantiated shipment
    let wms = new WMSDatabaseApis();
    const shipmentObj = {
        orderID: undefined,
        trackingID: undefined,
        upc0: undefined,
        upc0Qty: undefined,
        upc1: undefined,
        upc1Qty: undefined,
        upc2: undefined,
        upc2Qty: undefined,
        upc3: undefined,
        upc3Qty: undefined,
        orgNm: undefined,
    }
    wms.getShippedNotVerifiedShipment(startDateUnix)
        .then(unsubstantiatedShipment => (
            unsubstantiatedShipment.map((unformattedshipment) => {
                let shipment = Object.create(shipmentObj)
                shipment.orderID = unformattedshipment["orderID"];
                shipment.orgNm = unformattedshipment["orgNm"];
                shipment.trackingID = unformattedshipment["tracking"];
                if (unformattedshipment.rcIts.length > 0) {
                    unformattedshipment.rcIts.forEach((item, index) => {
                        shipment[`upc${index}`] = item["UPC"];
                        shipment[`upc${index}Qty`] = item["qty"];
                    })
                }
                return shipment;
            })
        ))
        .then(formattedShipmentArr => {
            res.json(formattedShipmentArr)
        })
        .catch(err => {
            res.status(500).json({ msg: `Unable to get unsubstantiated Shipment\n\n${err}` })
        })
})

router.post('/needToShip/confirmShipment', auth, (req, res) => {
    console.log(`*************confirm Shipment*************`);
    const { allUnShipment } = req.body;

    let wms = new WMSDatabaseApis();
    console.log(`all unShipment: `, allUnShipment)
    const { unShipmentHandler, processedTrackings } = wms.createUnShipmentMapping(allUnShipment);
    console.log(`unshipment Map: `, unShipmentHandler);

    // concat 2 steps promise array:
    // update locationInv -> update shipment status

    Promise.allSettled(
        //concat update location Inv promises
        Array.from(unShipmentHandler)
            .map(([upc, { unShippedQty, orgNm }]) =>
                new Promise((resolve, reject) => {
                    wms.updateLocationInvQtyByUpc(upc, Number(unShippedQty))
                        .then(updateRes => resolve(updateRes))
                        .catch(err => {
                            reject({
                                action: "updateLocationInv",
                                reason: err.reason,
                                rejectedUpc: upc,
                                rejectedQty: Number(unShippedQty),
                                rejectedOrgNm: orgNm
                            })
                        }
                        );
                })
            )

            // concat update shipment status promises    
            .concat(
                processedTrackings.map(trackingId =>
                    new Promise((resolve, reject) => {
                        wms.updateShipmentStatus(trackingId, status.shipment.SUBSTANTIATED)
                            .then(updateRes => resolve(updateRes))
                            .catch((err) => {
                                reject({
                                    action: "updateShipmentStatus",
                                    reason: err.reason,
                                    trackingId: trackingId
                                })
                            })
                    })
                )
            )
    )
        .then((results) => {
            console.log(`results: `, JSON.stringify(results, null, 4))
            let allRejectedShipment = results.filter(res => res.status === "rejected")
            // console.log(`rejected promise results: `, allRejectedShipment)

            if (allRejectedShipment.length > 0) {
                res.status(400).json({ msg: `Rejected Shipment Occurs`, reason: allRejectedShipment })
            } else {
                res.json({ msg: `All Shipment fullfilled.` })
            }
        }).catch(err => {
            res.status(500).json({
                msg: `Reject updating sellerInv qty or locInv qty on Upc`,
                reason: err.reason
            })
        })


    // res.json({ msg: "yes" })
})

export default router;