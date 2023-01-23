import { Model } from "mongoose";
import PrimeCost, { IPrimeCost } from "../models/PrimeCost";

type Upc = string;

interface IOperationApi {
    getProductsPrimeCost: (items: Upc[]) => void;
}

export class OperationApi implements IOperationApi {
    private _PrimeCost: Model<IPrimeCost>;

    constructor() {
        this._PrimeCost = PrimeCost;
    }

    async getProductsPrimeCost(upcs: Upc[]) {
        let result = await Promise.all(upcs.map(upc =>
            PrimeCost.find({ upc: upc })
        ))
        console.log(result);
    }
}