import { Request } from 'express';
import { IPrimeCost } from "#root/lib/models/interface";
import { JwtPayload } from 'jsonwebtoken';

export type Upc = string;

type PrimeCostCategory = "product" | "accessories" | "";

export interface IResponseErrorMessage {
    msg: string,
    reason?: any,
}

export interface IPrimeCost extends Omit<IPrimeCost, "_id" | "created_date"> {
    upc: string;
};

export interface IPrimeCostXlsxTemplateDataType {
    upc: string;
    name: string;
    price: number | undefined;
    category: PrimeCostCategory;
}

export interface listingItem {
    id: number;
    asin: string;
    hdd: Hdd;
    os: Os;
    ram: Ram[];
    ssd: Ssd[];
    upc: string;
}

export interface IPrimeCostCalcReqBody {
    dataSource: listingItem[],
    addon: any[],
    profitRate: number
}

type FulfillmentCenterId = "AMAZON_NA" | undefined;
type MerchantShippingGroup = "USprime" | undefined;

export interface ISkuUploadFeedsType {
    "sku": string;
    "product-id": string;
    "product-id-type": number;
    "price": number;
    "minimum-seller-allowed-price": number;
    "maximum-seller-allowed-price": number;
    "item-condition": number;
    "quantity": number;
    "add-delete": string;
    "will-ship-internationally": undefined;
    "expedited-shipping": undefined;
    "standard-plus": undefined;
    "item-note": undefined;
    "fulfillment-center-id": FulfillmentCenterId;
    "product-tax-code": undefined;
    "handling-time": undefined;
    "merchant_shipping_group_name": MerchantShippingGroup;
}