import { Document } from "mongoose";

type T = any;

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
/* 
    @desc: For locationInv DB docs
*/
export interface LocationDoc extends Document {
    upc: string,
    loc: string,
    qty: number
}

export interface IUnShipment<upc = string, tracking = string> {
    unShipmentHandler: Map<upc, { qty: number, trackings: Array<string> }>,
    processedTrackings: Set<tracking>
}

export interface INeedToShipMap<upc = string, qty = number> extends Map<upc, qty> { }

export interface IUnShipmentMap<upc = string> extends Map<upc, { qty: number, trackings: Array<string> }> { };

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