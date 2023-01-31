import { IPrimeCost } from "#root/lib/models/interface";

export type Upc = string;
type primeCostCategory = "product" | "accessories" | "";

export interface IResponseErrorMessage {
    msg: string,
    reason?: any,
}

export interface IPrimeCost extends Omit<IPrimeCost, "_id" | "created_date"> {
    upc: string;
};

export interface IPrimeCostXlsxDataType {
    upc: string;
    name: string;
    price: number | undefined;
    category: primeCostCategory;
}