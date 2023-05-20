import { AxiosError, AxiosResponse } from "axios";
import { Action, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { RootState } from "./store/store";

export type ActionType = string;

export interface IReduxError {
    status: number;
    msg: string;
    reason: unknown;
}

export interface IReduxAuth {
    isAuthenticated: boolean;
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

export interface ISkuUploadFeeds extends VerifiedSellerAllowedPriceDataSourceType {
    "will-ship-internationally": undefined;
    "expedited-shipping": undefined;
    "standard-plus": undefined;
    "item-note": undefined;
    "product-tax-code": undefined;
    "handling-time": undefined;
}
export interface VerifiedSellerAllowedPriceDataSourceType {
    "sku": string;
    "product-id": string;
    "product-id-type": number;
    "price": number;
    "minimum-seller-allowed-price": number;
    "maximum-seller-allowed-price": number;
    "item-condition": number;
    "quantity": number;
    "add-delete": string;
    "fulfillment-center-id": FulfillmentCenterId;
    "merchant_shipping_group_name": MerchantShippingGroup;
}
export interface DealsDataSourceType {
    _id: string;
    sku: string;
    link: string;
    name: string;
    key: string;
    currentPrice: number;
    isCurrentPriceLower: boolean;
    priceDiff: number;
    captureDate: Date;
}

export interface ReduxRootState {
    item: ItemReducerState;
    error: ErrorReducerState;
    auth: AuthReducerState;
    amazon: AmazonReducerState;
}

export interface AmazonReducerState {
    sellingPartner: any[];
    loading: boolean;
    primeCost: VerifiedSellerAllowedPriceDataSourceType[];
}
export interface ItemReducerState { };
export interface ErrorReducerState {
    msg: string,
    status: number,
    id?: string,
    reason?: string | object | any[]
};
export interface AuthReducerState {
    token: string,
    isOAuth: boolean
};

export interface MyThunkAction extends ThunkAction<void, RootState, unknown, AnyAction> { };
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>