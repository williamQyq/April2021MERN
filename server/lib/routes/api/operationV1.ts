import auth from "#root/lib/middleware/auth";
import { Request, Response, Router } from "express";
import { Listings, OperationApi } from "#root/lib/query/OperationApi";
import { AmazonSellingPartnerDataProcessor as AmzDbProcessor } from "#root/lib/query/amazon.query";
import { AmzProdPricingDoc } from "#root/lib/models/Amazon.model";
import { parseCsvHelper } from "#root/bin/helper/parseHelper";
import {
    IPrimeCost as IRoutePrimeCost,
    IResponseErrorMessage,
    IPrimeCostXlsxTemplateDataType,
    ISkuUploadFeedsType,
    IPrimeCostCalcReqBody,
    listingItem,
    Upc,
    Asin
} from "./interface";
import { MongoError } from "mongodb";
import excel from 'exceljs';
import { SPAPI } from "#root/bin/amazonSP/SPAPI";

interface PromiseRejectedResult {
    reason: MongoError;
}
type MappingFile<T, S> = [T, S][];
type UpcAsinMappingFile = MappingFile<string, string>;

const router: Router = Router();

// @route GET api/amazonSP
// @desc: get all amazon seller central sync product pricing offers 
router.get('/products/pricing/v1/price', (req, res) => {
    let db = new AmzDbProcessor();
    db.findAllProdPricing()
        .then((products: AmzProdPricingDoc[]) => res.json(products));
});

// @route POST api/amazonSP
// @desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/v0/asinsMapping', auth, (req: Request<{}, {}, { uploadFile: UpcAsinMappingFile }>, res: Response) => {
    const { uploadFile } = req.body;
    const sellingPartner = new SPAPI();

    console.log(`[Received File]:\n`)
    console.table(uploadFile);

    processMappingFile(uploadFile)
        .then(() => { res.json({ msg: 'success' }) })
        .then(() => sellingPartner.updateProdPricingCatalogItems())
        .catch(e => {
            res.status(400).json({ msg: `Upload File contains Invalid Input\n\n${e}` })
        })
        .finally(() => console.log('Upload Finished'))
})

/* 
@attention: can be improve later, grouping upc asin, reduce I/O
@param: file: Array<Array<upc:string,asin:string>>
@return: Promise.allSettled
*/
async function processMappingFile(fileWithHeaderRow: UpcAsinMappingFile) {
    let dbOperation = new AmzDbProcessor();
    fileWithHeaderRow.shift(); //remove header row;

    return Promise.allSettled(
        fileWithHeaderRow.map((row: [Upc, Asin]) => {
            let upc = row[0];
            let asin = row[1];
            return dbOperation.upsertProdPricingNewAsin(upc, asin)
        })
    )
}


router.get('/upload/v1/getProductsPrimeCost/:upc', auth, (req: Request, res: Response) => {
    const { upc } = req.params as { upc: string };
    let api = new OperationApi();
    api.getPrimeCostByUpc(upc)
        .then(result => res.json(result))
        .catch((err: Error) => {
            res.status(404)
        });

})

/**
 * @description: save products prime cost to db
 * 
 */
router.put('/primeCost/v1/ProductsPrimeCost', auth, (req: Request, res: Response) => {
    const { fileData, isOverriden }: { fileData: string[][]; isOverriden: boolean } = req.body;
    let ProdsPrimeCost = parseCsvHelper<IRoutePrimeCost>(fileData);  //parse string[][] to array of prod obj.
    if (!ProdsPrimeCost) {
        let errorMsg: IResponseErrorMessage = { msg: "Fail to save prime cost." }
        return res.status(400).json(errorMsg);
    }

    let api = new OperationApi();
    Promise.all(
        ProdsPrimeCost!.filter(prod => prod.upc && prod.upc !== '').map((prod: IRoutePrimeCost) => {
            return isOverriden ?
                api.updateProductPrimeCost(prod)
                : api.saveProductPrimeCost(prod);
        })
    )
        .then(result => res.json(result))
        .catch((err: MongoError) => {
            console.error(`MongoError: `, err.message);
            let errorMsg: IResponseErrorMessage = { msg: "Fail to save prime cost.", reason: err.message };
            res.status(400).json(errorMsg);
        });
})

/**
 * Attention: Needs to be optimized later. Disgusting.
 */
router.post('/primeCost/v1/skus/profitRate/addon/dataSource', auth, async (req: Request<{}, {}, IPrimeCostCalcReqBody>, res: Response) => {
    const { addon, dataSource, profitRate } = req.body;
    const primeCostKeys = ['ram', 'ssd', 'upc', 'os'];  //interactive keys of prime cost.

    let api = new OperationApi();
    const primeCostReqSet = new Set<string>();  //unique set of prime cost checking items
    if (dataSource.length === 0) {
        let errorMsg: IResponseErrorMessage = { msg: "Please enter input to your SKU Creation Table.", reason: 'Received empty sku creation table.' };
        return res.status(400).json(errorMsg);
    }
    // add unique config item to primeCostReqSet - e.g. PCIE1024
    dataSource.forEach(listing => {
        //[RAM]
        listing.ram.forEach(ramType => {
            if (!primeCostReqSet.has(ramType))
                primeCostReqSet.add(ramType);
        });
        //[SSD]
        listing.ssd.forEach(ssdType => {
            if (!primeCostReqSet.has(ssdType))
                primeCostReqSet.add(ssdType);
        });
        //[HDD]
        if (listing.hdd !== "None")
            primeCostReqSet.add(listing.hdd);
        //[UPC]
        if (!primeCostReqSet.has(listing.upc))
            primeCostReqSet.add(listing.upc)
        //[OS]
        primeCostReqSet.add(listing.os);

    })

    //[Addon] add unique bundle add on item to primeCostReqSet
    addon.forEach((bundleItem: string) => {
        if (!primeCostReqSet.has(bundleItem))
            primeCostReqSet.add(bundleItem)
    })

    //retrieve all needed prime cost from db
    const primeCostMap: Map<string, number> | void = await Promise.allSettled(
        Array.from(primeCostReqSet).map(reqPrimeCostUpc => {
            return api.getPrimeCostByUpc(reqPrimeCostUpc);
        }))
        .then(uniquePrimeCostPromRes => {
            let hasRejected: boolean = uniquePrimeCostPromRes.filter(prom => prom.status === 'rejected').length > 0

            // if has req not found in prime cost db collection table, throw error
            if (hasRejected) {
                let reasons = uniquePrimeCostPromRes.filter(prom => prom.status === 'rejected') as PromiseRejectedResult[];
                let errReasons = reasons.reduce((prev: string, next: PromiseRejectedResult) => (
                    prev + next.reason.message + "\n"
                ), "");
                throw errReasons;
            }

            return uniquePrimeCostPromRes;
        })
        .then(uniquePrimeCostPromRes => {
            let promiseFulfilledResults = uniquePrimeCostPromRes!.filter(prom => prom.status === 'fulfilled')
                .map(settledProm => (settledProm as PromiseFulfilledResult<[string, number]>).value)

            return new Map(promiseFulfilledResults);
        })
        .catch((errReason: string) => {
            let errorMsg: IResponseErrorMessage = { msg: "Fail to calc sku Prime Cost", reason: errReason };
            console.error(`[Failed] ${JSON.stringify(errReason, null, 4)}`);
            res.status(400).json(errorMsg);
            return;
        });

    // **something went wrong, neither upc nor cost Map created
    if (!primeCostMap || primeCostMap.size === 0) {
        console.error(`[Failed] no prime cost map.`)
        return;
    }

    // creating sku listings upload feeds ...
    const listingsItemSubmission = dataSource.map((newListing: listingItem) => {
        let listingPrimeCost = 0;   //the init prime cost of each listing.

        //accumulate all items' prime cost by key
        primeCostKeys.forEach((key) => {
            let value = newListing[key as keyof typeof newListing]
            if (value.constructor === Array) {
                value.forEach(element => {
                    if (primeCostMap.has(element))
                        listingPrimeCost += primeCostMap.get(element)!;
                })
            } else if (primeCostMap.has(value as string)) {
                listingPrimeCost += primeCostMap.get(value as string)!;
            }
        })

        addon.forEach(item => {
            if (primeCostMap.has(item)) {
                listingPrimeCost += primeCostMap.get(item)!;
            }
        })

        let listing: Listings | null = new Listings({ ...newListing });
        let listingAttributes = listing.putListingItem(listingPrimeCost, profitRate);

        return listingAttributes;
    });
    res.json(listingsItemSubmission);

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
    let sampleData: IPrimeCostXlsxTemplateDataType = {
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

router.patch('/listings/v1/offers', auth, (req: Request<{}, {}, ISkuUploadFeedsType[]>, res: Response) => {
    const listingOffers = req.body;
    console.log(req.body);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("skuUpload");
    const headers = ["sku", "product-id", "product-id-type", "price", "minimum-seller-allowed-price", "maximum-seller-allowed-price", "item-condition", "quantity", "add-delete", "will-ship-internationally", "expedited-shipping", "standard-plus", "item-note", "fulfillment-center-id", "product-tax-code", "handling-time", "merchant_shipping_group_name"]
    // const values = [196801739468-32102400H00P-AZM-B0BPHP6D2Z	B0BPHP6D2Z	1	863.99	858.99	1717.98	11	0	a								USprime]
    let skuOfferCols = headers.map(header => ({ header: header, key: header, width: 20 }));
    worksheet.columns = skuOfferCols;

    worksheet.addRows(listingOffers);
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