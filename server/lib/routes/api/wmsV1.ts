import { Request, Response, Router } from "express";
import fs from 'fs-extra';
import { ReadStream, Stats } from "fs";
import auth from "#middleware/auth";
import { PdfGenerator } from "#root/bin/pdfGenerator/pdfGenerator";
import { WmsDBApis } from "#root/lib/query/WmsDBApis";
import {
    IReqBodyShipmentDownloadPickUpPDF,
    IResponseErrorMessage,
} from "#root/@types/interface";
import { GSheetNeedToShip } from "bin/gsheet/index";

const router: Router = Router();

router.post('/shipment/v1/downloadPickUpPDF', auth, (req: Request, res: Response) => {
    const reqBody: IReqBodyShipmentDownloadPickUpPDF = req.body;
    const { fileName } = reqBody.requiredFields;
    const wms = new WmsDBApis();
    const gsheet = new GSheetNeedToShip();
    gsheet.getNeedToShipUpgradeTasks()
        .then((needUpgradeTrackings) =>
            wms.createPickUpFromReadyShipment(needUpgradeTrackings)
        )
        //create pickup pdf...
        .then(({ pickUpData, processedTrackings }) => {
            const pdfGenerator = new PdfGenerator();
            pdfGenerator.generatePickUpPDF(fileName, pickUpData)
                .then(savedFilePath => {
                    let file: ReadStream = fs.createReadStream(savedFilePath!, { highWaterMark: 64 * 1024 });
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
                .catch((err: Error) => {
                    console.error(err.message);
                    let errorMsg: IResponseErrorMessage = { msg: "Failed to generate PDF", reason: err.message }
                    res.status(400).json(errorMsg);
                });
            console.log(`processedTrackings: \n`, processedTrackings, `\n\n`)
            return processedTrackings;
        })
        // .then(processedTrackings => wms.updateAllShipmentStatus(processedTrackings, shipmentStatus.PICK_UP_CREATED))
        .catch(err => {
            console.error(err)
            let errorMsg: IResponseErrorMessage = { msg: "Create PickUp PDF Failed.", reason: err.message };
            res.status(400).json(errorMsg);
        })

})

router.get('/shipment/v1/getPickUpPendingAndTotal', auth, (req: Request, res: Response) => {
    const wms = new WmsDBApis();
    wms.countNeedToShipPickUpFromShipment()
        .then(pickUpCount => {
            res.json(pickUpCount)
        })
        .catch(err => {
            console.error(err)
            let errorMsg: IResponseErrorMessage = { msg: "Count PickUp Failed.", reason: err.message };
            res.status(400).json(errorMsg);
        })
})

export default router;