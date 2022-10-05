import { Request, Response, Router } from "express";
import fs from 'fs-extra';
import { ReadStream, Stats } from "fs";
import auth from "#rootTS/lib/middleware/auth.js";
import { PdfGenerator } from "#rootTS/bin/pdfGenerator/pdfGenerator.js";
import { shipmentStatus, WmsDBApis } from "#rootTS/lib/query/WmsDBApis.js";
import {
    IReqBodyShipmentDownloadPickUpPDF,
    IResponseErrorMessage,
    IUpdateShipmentStatusErrorMessage,
} from "@types";

const router: Router = Router();

router.post('/shipment/v1/downloadPickUpPDF', auth, (req: Request, res: Response) => {
    const reqBody: IReqBodyShipmentDownloadPickUpPDF = req.body;
    const { fileName } = reqBody.requiredFields;
    const wms = new WmsDBApis();
    wms.createPickUpFromReadyShipment()
        .then(({ pickUpData, processedTrackings }) => {
            const pdfGenerator = new PdfGenerator();
            pdfGenerator.generatePickUpPDF(fileName, pickUpData)
                .then(savedFilePath => {
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
                });
            return processedTrackings;
        })
        // .then(processedTrackings => wms.updateAllShipmentStatus(processedTrackings, shipmentStatus.PICK_UP_CREATED))
        // .then(result => console.log(result))
        .catch(err => {
            let errorMsg: IResponseErrorMessage = { msg: "Create PickUp PDF Failed.", reason: err.message };
            res.status(400).json(errorMsg);
        })

})

export default router;