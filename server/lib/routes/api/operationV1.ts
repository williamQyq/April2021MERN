import auth from "#rootTS/lib/middleware/auth.js";
import { Request, Response, Router } from "express";
import { OperationApi } from "#rootTS/lib/query/OperationApi.js";
import { parseCsvHelper } from "#rootTS/bin/helper/parseHelper.js";
import { Upc, IPrimeCost as IRoutePrimeCost, IResponseErrorMessage } from "./interface";
import { MongoError } from "mongodb";
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

router.post('/operation/v1/calcSkuPrice', auth, (req: Request, res: Response) => {
    const items: Upc[] = req.body;



})

export default router;