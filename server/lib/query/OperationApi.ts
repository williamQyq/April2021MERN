import { FilterQuery, UpdateQuery, QueryOptions, Model } from "mongoose";
import PrimeCost from "#rootTS/lib/models/PrimeCost.js";
import { IPrimeCost } from "../models/interface";
import { IPrimeCost as IRoutePrimeCost, Upc } from "../routes/api/interface.d";

interface IOperationApi {
    getProductsPrimeCost: (items: Upc[]) => void;
    saveProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
    updateProductPrimeCost: (prod: IRoutePrimeCost) => Promise<any>;
}
/**
 * @description lagacy version of OperationApi is in ./utitlities.js
 */
export class OperationApi implements IOperationApi {
    private _PrimeCost: Model<IPrimeCost>;

    constructor() {
        this._PrimeCost = PrimeCost;
    }

    async getProductsPrimeCost(upcs: Upc[]) {
        let result = await Promise.all(upcs.map(upc =>
            this._PrimeCost.find({ upc: upc })
        ))
        console.log(result);
        return result;
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