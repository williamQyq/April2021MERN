import { FilterQuery, UpdateQuery, QueryOptions, Model } from "mongoose";
import PrimeCost from "#rootTS/lib/models/PrimeCost.js";
import { IPrimeCostDoc } from "../models/interface";
import { IPrimeCost as IRoutePrimeCost, Upc } from "../routes/api/interface.d";

interface IOperationApi {
    getPrimeCostByUpc: (upc: Upc) => Promise<[Upc, number]>;
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

    async getPrimeCostByUpc(upc: Upc): Promise<[Upc, number]> {

        let doc = await this._PrimeCost.find({
            _id: {
                upc: upc
            }
        })
        if (doc.length <= 0) {
            throw new Error(`Failure upc: ${upc}`)
        }
        const upcPrimeCost = doc[0].price;
        return [upc, upcPrimeCost];
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
        console.log('update prod: ', prod)
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