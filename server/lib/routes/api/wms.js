import express from 'express';
import auth from '#middleware/auth.js';
import excel from 'exceljs';
import { WMSDatabaseApis, GsheetApis } from '../../query/utilities.js';
import { status } from '../../query/aggregate.js';

const router = express.Router();

//@route GET api/wms
//@desc get warehouse quantity on upc
router.get('/sellerInv/v0/quantity/upc/:upc', (req, res) => {
    let upc = req.params.upc;
    let wms = new WMSDatabaseApis();
    wms.findUpcQtyOnOrg(upc)
        .then(qty => { res.json(qty) });
});

//@route POST api/wms
//@desc get warehouse quantity on multiple upcs
router.post('/sellerInv/v0/quantity/upcs', auth, (req, res) => {
    const { upcArr } = req.body;
    let result = [];
    let wms = new WMSDatabaseApis();
    wms.findUpcQtyMultiOnOrg(upcArr)
        .then(docs => {
            docs.forEach(doc => { result.push([doc._id.UPC, doc.qty]) })   //create array of array: upc, qty array mapping
            res.json(result)
        })
        .catch(err => {
            console.error(err.message);
            res.status(502).json({ msg: "WMS connection error" })
        })

})

//@route POST api/wms
//@desc update warehouse quantity on multiple upcs
//@availability false
router.post('/sellerInv/subtractQty', auth, (req, res) => {

    res.status(503).json({ msg: "Update WMS Service Unavailable" })
})

router.post('/inventoryReceive/v0/getInventoryReceived', auth, (req, res) => {
    const { requiredFields } = req.body;
    let wms = new WMSDatabaseApis();
    wms.getInventoryReceive(requiredFields)
        .then(validRecItems => { res.json(validRecItems) })
        .catch(err => {
            console.error(err.message);
            res.status(400).json({ msg: "Fail to get Inventory Received", reason: err.message })
        })
})

//@route GET api/wms
router.get('/inventoryReceive/v0/getWrongAdds', auth, (req, res) => {
    const db = wms.getDatabase();
    const collection = db.collection('inventoryReceive');

    collection.find({ 'orgNm': 'wrongadds' }).toArray()
        .then(docs => {
            console.log(`[routes] receive inventoryReceive wrongadds GET request...`)
            res.json(docs)
            // return docs;
        })
});


//@route get api/wms
//@desc sync warehouse inventory Received with ForUpload Gsheet
router.get('/inventoryReceive/v0/getInventoryReceiveInHalfMonth/updateGsheet', auth, (req, res) => {
    let wms = new WMSDatabaseApis();
    let gsheet = new GsheetApis();

    wms.getInventoryReceiveInHalfMonth()
        .then(receivedItems => gsheet.createArrayOfArrayFromDocumentsInOrder(GsheetApis._forUploadSpreadSheet, receivedItems))
        .then(values => gsheet.updateSheet(GsheetApis._forUploadSpreadSheet, values))
        .then(() => { res.json("success") })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({ msg: "Fail to get Inventory Received or Update Gsheet" })
        })

})

router.get('/shipment/v0/getNeedToShipItems/limit/:docLimit/skip/:docSkip', auth, (req, res) => {
    const { docLimit, docSkip } = req.params;
    let wms = new WMSDatabaseApis();
    wms.getNeedToShipFromShipment(Number(docLimit), Number(docSkip))// params in req are strings, mongodb limit query accepts number only
        .then(needToShipItems => {
            wms.countNeedToShipFromShipment()
                .then((totalShipmentCount) => res.json({ shipment: needToShipItems, totalShipmentCount }))
        })
        .catch((err => {
            console.error(err.message);
            res.status(500).json({ msg: "Fail to get Shipment" })
        }))
})
router.get('/shipment/v0/getPendingAndTotal/:orgNm', auth, (req, res) => {
    const { orgNm } = req.params;
    let wms = new WMSDatabaseApis();
    wms.getShipmentCountByOrgNm(orgNm)
        .then((shipmentCountInfo) => {
            res.json(shipmentCountInfo)
        })
})

router.post('/inventoryReceive/v0/updateRecOnTracking', auth, (req, res) => {
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
        .catch(err => {
            console.error(err.message);
            res.status(400).json({ msg: `Upload File contains Invalid Input\n\n${err}` })
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

router.get('/inventoryReceive/v0/downloadSampleXlsx', (req, res) => {
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
    workbook.xlsx.write(res)
        .then(() => { res.status(200).end(); });
})

router.get('/needToShip/syncGsheet', auth, (req, res) => {
    let gsheet = new GsheetApis();

    gsheet.batchReadSheet(GsheetApis._needToShipSpreadSheet).then((res) => {
        console.log(res.valueRanges[0].values)
    })

    res.json({ msg: "success" })
})

router.get('/shipment/v0/getNotVerifiedShipment/dateMin/:dateMin/dateMax/:dateMax', auth, (req, res) => {
    // const { dateMin, dateMax } = req.params;
    const startDateUnix = 1660622400000;    //2022-08-16 00:00:00 since then, get all unsubstantiated shipment
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
            console.error(err.message);
            res.status(500).json({ msg: `Unable to get unsubstantiated Shipment\n\n${err}` })
        })
})

router.post('/needToShip/v0/confirmShipment', auth, (req, res) => {
    console.log(`*************confirm Shipment*************`);

    const { allUnShipment } = req.body;

    let wms = new WMSDatabaseApis();
    const { unShipmentHandler, processedTrackings } = wms.createUnShipmentMapping(allUnShipment);
    // console.log(`all unShipment: `, allUnShipment)
    // console.log(`unshipment Map: `, unShipmentHandler);

    // // concat 2 steps promise array:
    // // update locationInv -> update shipment status

    Promise.allSettled(
        // update qty on location Inv
        Array.from(unShipmentHandler)
            .map(([upc, { unShippedQty, trackings }]) =>
                new Promise((resolve, reject) => {
                    wms.updateLocationInvQtyByUpc(upc, Number(unShippedQty))
                        .then(updateRes => {
                            resolve(updateRes)
                        })
                        .catch(err => {
                            reject({
                                action: "updateLocationInv",
                                reason: err.message,
                                rejectedUpc: upc,
                                rejectedQty: Number(unShippedQty),
                                rejectedTrackings: trackings
                            })
                        });
                })
            )
    )
        //update fulfilled shipment status 
        .then(async (results) => {

            //get rejected trackings for fulfilled trackings filter
            let allRejectedTrackings = new Array();
            const rejectedShipment = results.filter(res => res.status === "rejected")
            rejectedShipment.forEach(shipment => {
                const { reason: { rejectedTrackings } } = shipment;
                allRejectedTrackings = [...allRejectedTrackings, ...rejectedTrackings];
            })

            const allTrackings = Array.from(processedTrackings);
            //fulfilled trackings filter
            const fulfilledTrackings = allTrackings.filter(tracking => (
                allRejectedTrackings.indexOf(tracking) === -1 ? true : false
            ))
            await Promise.allSettled(
                //array of update shipment status promise
                fulfilledTrackings.map(trackingId =>
                    new Promise((resolve, reject) => {
                        wms.updateShipmentStatus(trackingId, status.shipment.SUBSTANTIATED)
                            .then(updateRes => resolve(updateRes))
                            .catch((err) => {
                                reject({
                                    action: "updateShipmentStatus",
                                    reason: err.msg,
                                    trackingId: trackingId
                                })
                            })
                    })
                )
            )
            return results;
        })
        .then((results) => {
            console.log(`results: `, JSON.stringify(results, null, 4))
            let allRejectedShipment = results.filter(res => res.status === "rejected")
            // console.log(`rejected promise results: `, allRejectedShipment)

            if (allRejectedShipment.length > 0) {
                res.status(400).json({ msg: `Rejected Shipment Occurs`, reason: allRejectedShipment })
            } else {
                res.json({ msg: `All Shipment fullfilled.` })
            }
        })
        .catch(err => {
            console.log(`err: `, err)
            res.status(500).json({
                msg: `Reject updating sellerInv qty or locInv qty on Upc`,
                reason: err.message
            })
        })


})

router.post('/shipment/v0/getShipment', auth, (req, res) => {
    const { requiredFields } = req.body;
    const wms = new WMSDatabaseApis();
    wms.getShipment(requiredFields)
        .then(validShipment => {
            res.json(validShipment)
        })
        .catch(err => {
            console.error(err.message);
            res.status(400).json({
                msg: `Reject get shipment by required fields`,
                reasoon: err.message
            })
        })
})

//@desc: download xlsx shipment records
router.post('shipment/v0/downloadShipmentXlsx', auth, (req, res) => {
    const { requiredFields } = req.body;
    res.json();
})

//@desc: download xlsx inventory receival records
router.post('inventoryReceive/v0/downloadReceivalXlsx', auth, (req, res) => {
    const { requiredFields } = req.body;
    res.json();
})

//@desc: download xlsx location inventory records
router.post('locationInventory/v0/downloadLocationInventoryXlsx', auth, (req, res) => {
    const { requiredFields } = req.body;
    res.json();
})

router.post('/locationInventory/v0/getLocationInventory', auth, (req, res) => {
    const { requiredFields } = req.body;
    const wms = new WMSDatabaseApis();
    wms.getLocation(requiredFields)
        .then(validShipment => {
            res.json(validShipment)
        })
        .catch(err => {
            console.error(err.message);
            res.status(400).json({
                msg: `Reject get shipment by required fields`,
                reasoon: err.message
            })
        })
})

router.post('/sellerInventory/v0/getSellerInventory', auth, (req, res) => {
    const { requiredFields } = req.body;
    const wms = new WMSDatabaseApis();
    wms.getSellerInventory(requiredFields)
        .then(validShipment => {
            res.json(validShipment)
        })
        .catch(err => {
            console.error(err.message);
            res.status(400).json({
                msg: `Reject get Seller Inventory by required fields`,
                reasoon: err.message
            })
        })
})

export default router;