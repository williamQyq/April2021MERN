import { AxiosError, AxiosResponse } from "axios";

export type ActionType = string;

export interface IReduxError {
    status: number;
    msg: string;
    reason: unknown;
}

export interface IReduxAuth {
    token: string;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface myAxiosResponse extends AxiosResponse {
    data: {
        msg: string,
        reason: string,
        action?: ActionType,

    }
}
export interface myAxiosError extends AxiosError {
    response: myAxiosResponse;
};

export interface IRequestBody {
    fileData?: any;
    isOverriden?: boolean;
}
export interface UploadPrimeCostRequestBody extends Required<IRequestBody> { }

type FulfillmentCenterId = "AMAZON_NA" | undefined;
type MerchantShippingGroup = "USprime" | undefined;

export interface ISkuUploadFeeds {
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