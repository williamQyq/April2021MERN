import { Aggregate } from "mongoose";

type Aggregate = Array<any>;
export declare const GET_NEED_TO_SHIP_ITEMS_FOR_PICKUP_BY_TODAY: Aggregate;

export declare function GET_UPC_LOCATION_QTY_EXCEPT_WMS(upc: string): Aggregate;
export declare function GET_UPC_BACK_UP_LOCS_FOR_PICK_UP(upc: string): Aggregate;
export declare const COUNT_CREATED_PICKUP_LABEL: Aggregate;