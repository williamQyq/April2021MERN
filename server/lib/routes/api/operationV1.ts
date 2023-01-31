import auth from "#rootTS/lib/middleware/auth.js";
import { Request, Response, Router } from "express";
import { OperationApi } from "#rootTS/lib/query/OperationApi.js";
import { parseCsvHelper } from "#rootTS/bin/helper/parseHelper.js";
import { Upc, IPrimeCost as IRoutePrimeCost, IResponseErrorMessage, IPrimeCostXlsxDataType, ISkuUploadFeedsType } from "./interface";
import { MongoError } from "mongodb";
import excel from 'exceljs';

const router: Router = Router();

router.post('/upload/v1/getProductsPrimeCost', auth, (req: Request, res: Response) => {
    const items: Upc[] = req.body;
    let api = new OperationApi();
    api.getProductsPrimeCost(items)
        .then(result => res.json(result));

})

/**
 * @description: save products prime cost to db
 * 
 */
router.post('/upload/v1/saveProductsPrimeCost', auth, (req: Request, res: Response) => {
    const { fileData, isOverriden }: { fileData: string[][]; isOverriden: boolean } = req.body;
    let ProdsPrimeCost = parseCsvHelper<IRoutePrimeCost>(fileData);  //parse string[][] to array of prod obj.
    if (!ProdsPrimeCost) {
        let errorMsg: IResponseErrorMessage = { msg: "Fail to save prime cost." }
        return res.status(400).json(errorMsg);
    }
    let api = new OperationApi();
    Promise.all(ProdsPrimeCost!.map((prod: IRoutePrimeCost) => {
        return isOverriden ?
            api.updateProductPrimeCost(prod)
            : api.saveProductPrimeCost(prod);
    }))
        .then(result => res.json(result))
        .catch((err: MongoError) => {
            console.error(`MongoError: `, err.message);
            let errorMsg: IResponseErrorMessage = { msg: "Fail to save prime cost.", reason: err.message };
            res.status(400).json(errorMsg);
        });
})

router.post('/upload/v1/calcSkuPrice', auth, (req: Request, res: Response) => {
    const items: Upc[] = req.body;



})

router.get('/download/v1/downloadPrimeCostXlsxTemplate', (req: Request, res: Response) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Prime Cost");
    worksheet.columns = [
        { header: "UPC", key: "upc", width: 25 },
        { header: "Name", key: "name", width: 25 },
        { header: "Price", key: "price", width: 15 },
        { header: "category", key: "category", width: 20 }
    ];
    let rows = [];
    let sampleData: IPrimeCostXlsxDataType = {
        upc: "",
        name: "",
        price: undefined,
        category: ""
    }
    rows.push(sampleData);
    worksheet.addRows(rows);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "PrimeCostTemplate.xlsx"
    );
    workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
})

router.post('/download/v1/downloadInitSkuFeeds', (req: Request, res: Response) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Prime Cost");
    worksheet.columns = [
        { header: "UPC", key: "upc", width: 25 },
        { header: "Name", key: "name", width: 25 },
        { header: "Price", key: "price", width: 15 },
        { header: "category", key: "category", width: 20 }
    ];
    let rows = [];
    let sampleData: ISkuUploadFeedsType = {
        sku: "196801739468-32102400H00P-AZM-B0BPHP6D2Z",
        "product-id": "B0BPHP6D2Z",
        "product-id-type": 1,
        price: 863.99,
        "minimum-seller-allowed-price": 858.99,
        "maximum-seller-allowed-price": 1717.98,
        "item-condition": 11,
        quantity: 0,
        "add-delete": "a",
        "will-ship-internationally": undefined,
        "expedited-shipping": undefined,
        "standard-plus": undefined,
        "item-note": undefined,
        "fulfillment-center-id": "AMAZON_NA",
        "product-tax-code": undefined,
        "handling-time": undefined,
        "merchant_shipping_group_name": "USprime"
    }
    rows.push(sampleData);
    worksheet.addRows(rows);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "PrimeCostTemplate.xlsx"
    );
    workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
});

export default router;