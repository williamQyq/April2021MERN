import express from 'express';
import auth from '#middleware/auth.js';
import { WMSDatabase,Gsheet } from '#query/utilities.js';
const router = express.Router();

router.get('/googleService/getAndUpdateInventoryReceived', auth, (req, res) => {
    let wmsUtil = new WMSDatabase();
    let gsheetUtil = new Gsheet();

    wmsUtil.getInventoryReceive()
        .then((inventoryReceivedRecord) => {
            return [[]];
        })
        .then((arrayOfArrayRecord) => gsheetUtil.updateSheet(Gsheet.forUploadSpreadSheet, arrayOfArrayRecord))
        .then(() => res.json("success"))
        .catch(() => res.status(500).json("Fail to get Inventory Received or Update Gsheet"))
})

export default router;