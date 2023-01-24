import { Model } from "mongoose";
import PrimeCost, { IPrimeCost } from "#rootTS/lib/models/PrimeCost.js";

type Upc = string;

interface IOperationApi {
    getProductsPrimeCost: (items: Upc[]) => void;
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
    }
}