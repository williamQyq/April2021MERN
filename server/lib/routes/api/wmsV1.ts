import { Request, Response, Router } from "express";
import fs from 'fs-extra';
import { ReadStream, Stats } from "fs";
import auth from "#rootTS/lib/middleware/auth.js";
import { PdfGenerator } from "#rootTS/bin/pdfGenerator/pdfGenerator.js";
import { WmsDBApis } from "#rootTS/lib/query/WmsDBApis.js";
import { IReqBodyShipmentDownloadPickUpPDF, IResponseErrorMessage } from "@types";
const router: Router = Router();

router.post('/shipment/v1/downloadPickUpPDF', auth, (req: Request, res: Response) => {
    const reqBody: IReqBodyShipmentDownloadPickUpPDF = req.body;
    const { fileName } = reqBody.requiredFields;
    const wms = new WmsDBApis();
    wms.createPickUpFromReadyShipment()
        .then(pickUpData => {
            const pdfGenerator = new PdfGenerator();
            return pdfGenerator.generatePickUpPDF(fileName, pickUpData);
        })
        .then((savedFilePath) => {
            let file: ReadStream = fs.createReadStream(savedFilePath!);
            let stat: Stats = fs.statSync(savedFilePath!);
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
                "attachment; filename=" + fileName
            );
            file.pipe(res); //res end() event being callled automatically.
        })
        .catch(err => {
            let errorMsg: IResponseErrorMessage = { msg: "Create PickUp PDF Failed." };
            res.status(400).json(errorMsg);
        })

})

export default router;