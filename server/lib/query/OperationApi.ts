import { FilterQuery, UpdateQuery, QueryOptions, Model } from "mongoose";
import PrimeCost from "#rootTS/lib/models/PrimeCost.js";
import { IPrimeCostDoc } from "../models/interface";
import { IPrimeCost as IRoutePrimeCost, Upc } from "../routes/api/interface.d";

interface IOperationApi {
    getPrimeCostByUpc: (upc: Upc) => Promise<number | undefined>;
    saveProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
    updateProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
}
/**
 * @description lagacy version of OperationApi is in ./utitlities.js
 */
export class OperationApi implements IOperationApi {
    private _PrimeCost: Model<IPrimeCostDoc>;

    constructor() {
        this._PrimeCost = PrimeCost;
    }

    async getPrimeCostByUpc(upc: Upc) {

        let doc = await this._PrimeCost.find({ upc: upc })
        console.log(doc)
        return 0;
    }

    async saveProductPrimeCost(prod: IRoutePrimeCost) {
        const newPrimeCostDoc = new this._PrimeCost({
            _id: {
                upc: prod.upc,
            },
            name: prod.name,
            price: prod.price,
            category: prod.category
        });

        return newPrimeCostDoc.save();
    }

    async updateProductPrimeCost(prod: IRoutePrimeCost) {
        const filter: FilterQuery<any> = {
            _id: {
                upc: prod.upc
            }
        };
        const update: UpdateQuery<any> = {
            name: prod.name,
            price: prod.price,
            category: prod.category
        }
        const options: QueryOptions = { upsert: true };

        await this._PrimeCost.findOneAndUpdate(filter, update, options);

    }

}