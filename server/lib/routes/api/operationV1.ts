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
router.post('/primeCost/v1/ProductsPrimeCost', auth, (req: Request, res: Response) => {
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


router.get('/template/v1/PrimeCostXlsxTemplate', (req: Request, res: Response) => {
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
        upc: "198112354567",
        name: "RICK PC",
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

router.get('/listings/v1/initSkuFeeds', (req: Request, res: Response) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("skuUpload");
    const headers = ["sku", "product-id", "product-id-type", "price", "minimum-seller-allowed-price", "maximum-seller-allowed-price", "item-condition", "quantity", "add-delete", "will-ship-internationally", "expedited-shipping", "standard-plus", "item-note", "fulfillment-center-id", "product-tax-code", "handling-time", "merchant_shipping_group_name"]
    // const values = [196801739468-32102400H00P-AZM-B0BPHP6D2Z	B0BPHP6D2Z	1	863.99	858.99	1717.98	11	0	a								USprime]
    let skuUploadCols = headers.map(header => ({ header: header, key: header, width: 20 }));
    console.log(JSON.stringify(skuUploadCols, null, 4));
    worksheet.columns = skuUploadCols;
    let rows: ISkuUploadFeedsType[] = [];
    let sampleData: ISkuUploadFeedsType = {
        "sku": "196801739468-32102400H00P-AZM-B0BPHP6D2Z",
        "product-id": "B0BPHP6D2Z",
        "product-id-type": 1,
        "price": 863.99,
        "minimum-seller-allowed-price": 858.99,
        "maximum-seller-allowed-price": 1717.98,
        "item-condition": 11,
        "quantity": 0,
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
        "attachment; filename=" + "skuUpload.xlsx"
    );
    workbook.xlsx.write(res).then(() => {
        res.status(200).end();
    });
});

export default router;