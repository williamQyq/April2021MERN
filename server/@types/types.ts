import { Document } from "mongoose";

type T = any;
type upc = string;
type location = string;
type qty = number;
type tracking = string;
type trackings = tracking[];
/* 

    @source: express router receive axios request body
    @desc: download pick up pdf request body
*/
export interface IReqBodyShipmentDownloadPickUpPDF {
    requiredFields: {
        fileName: string
    }
}

/* 
    @desc: For Pick Up
*/
export interface PickUpItemsDoc extends Document {
    tracking: string,
    orgNm: string,
    rcIts: Array<{ UPC: string, qty: number, status?: string }>,
    crtTm: string;
    crtStmp: number,
    status: string,
    operStatus: string
}

export interface IPickUpCountDoc extends Document{
    pickUpPending:number,
    pickUpCreated:number
}
/* 
    @desc: For locationInv DB docs
*/
export interface LocationDoc extends Document {
    upc: string,
    loc: string,
    qty: number
}
export interface BackUpLocationDoc extends Document {
    _id: upc,
    backUpLocs: location[]
}

export interface IAwaitingShipment<tracking = string> {
    awaitingShipmentMapping: IAwaitingShipmentMap,
    processedTrackings: Set<tracking>
    unPorcessedTrackings: Set<tracking>
}

export interface INeedToShipMap extends Map<upc, qty> { }

export interface IAwaitingShipmentMapValue {
    qty: number,
    trackings: Array<string>,
}

export interface IAwaitingShipmentMap<upc = string> extends
    Map<upc, IAwaitingShipmentMapValue> { };

/* 
    @desc: express router error message & Db query error message
*/
export interface IResponseErrorMessage {
    msg: string,
    reason?: any
}

export interface IUpdateShipmentStatusErrorMessage extends IResponseErrorMessage {
    action: string
    rejectedTracking: string
}

export interface IDBQueryResponse {
    action: string;
    queryRes: boolean;
}

export interface IUpdateShipmentStatusResponse extends IDBQueryResponse {
    trackingID: string;
    newStatus: string
}