import express, { Router } from "express";
import fs from 'fs-extra';
import { ReadStream, Stats } from "fs";
import auth from "#rootTS/lib/middleware/auth.js";
import { PdfGenerator } from "#rootTS/bin/pdfGenerator/pdfGenerator.js";
import { pdfGeneratorDirPath } from "#rootTS/config.js";
import { WmsDBApis } from "#rootTS/lib/query/WmsDBApis.js";
const router: Router = express.Router();

router.post('shipment/v1/downloadPickUpPDF', auth, (req, res) => {
    const { pickUpRequiredFields } = req.body;
    const wms = new WmsDBApis();
    wms.createPickUpFromReadyShipment()
        .then(pickUpData => {
            const pdfGenerator = new PdfGenerator();
            return pdfGenerator.generatePickUpPDF(pickUpData);
        })
        .then(() => {
            let pdfFilePath: string = pdfGeneratorDirPath.concat('/pdf/', pickUpRequiredFields.fileName);
            let file: ReadStream = fs.createReadStream(pdfFilePath);
            let stat: Stats = fs.statSync(pdfFilePath);
            res.setHeader(
                "Content-Type",
                "application/pdf"
            );
            res.setHeader(
                "Content-Length",
                stat.size
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + pickUpRequiredFields.fileName
            );
            file.pipe(res); //res end() event being callled automatically.
        })

})

export default router;