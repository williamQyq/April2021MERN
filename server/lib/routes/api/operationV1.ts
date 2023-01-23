import PrimeCost, { IPrimeCost } from "#rootTS/lib/models/PrimeCost.js";
import auth from "#rootTS/lib/middleware/auth.js";
import { Request, Response, Router } from "express";
import { OperationApi } from "#root/lib/query/OperationApi";

const router: Router = Router();

type Upc = string;
type primeCostReqItems = Upc[];
type calcSkuPriceItems = primeCostReqItems;


router.post('/operation/v1/getProductsPrimeCost', auth, (req: Request, res: Response) => {
    const items: primeCostReqItems = req.body;
    let api = new OperationApi();
    api.getProductsPrimeCost(items)
        .then(result => res.json(result));

})

router.post('/operation/v1/saveProductPrimeCost', auth, (req: Request, res: Response) => {
    const primeCost: IPrimeCost = req.body;
    const newPrimeCostDoc = new PrimeCost({
        name: primeCost.name,
        price: primeCost.price,
    });

    newPrimeCostDoc.update()
        .then(result => res.json(result))
        .catch(() => res.status(404).json({ msg: "Fail to save prime cost." }));

})

router.post('/operation/v1/calcSkuPrice', auth, (req: Request, res: Response) => {
    const items: calcSkuPriceItems = req.body;

    Promise.all(items.map(item =>
        PrimeCost.find({ upc: item })
    ))

})

export default router;