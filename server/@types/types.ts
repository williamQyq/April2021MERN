type T = any;


export interface IResponseErrorMessage {
    msg: string
}

export interface IReqBodyShipmentDownloadPickUpPDF {
    requiredFields: {
        fileName: string
    }
}

export interface INeedToShipMap<upc = string, qty = number> extends Map<upc, qty> { }

export type PickUpItemsDocs = Array<{
    tracking: string,
    orgNm: string,
    rcIts: Array<{ UPC: string, qty: number, status?: string }>,
    crtTm: string;
    crtStmp: number,
    status: string,
    operStatus: string
}>

export type LocationDocs = Array<{
    upc: string,
    loc: string,
    qty: number
}>

export interface IUnShipment<upc = string, tracking = string> {
    unShipmentHandler: Map<upc, { qty: number, trackings: Array<string> }>,
    processedTrackings: Set<tracking>
}

export interface IUnShipmentMap<upc = string> extends Map<upc, { qty: number, trackings: Array<string> }> { };
