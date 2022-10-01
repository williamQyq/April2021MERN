type T = any;


export interface IResponseErrorMessage {
    msg: string
}

export interface IReqBodyShipmentDownloadPickUpPDF {
    requiredFields: {
        fileName: string
    }
}