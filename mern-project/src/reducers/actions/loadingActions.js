import {
    INVENTORY_RECEIVED_LOADING,
    SHIPMENT_ITEMS_LOADING,
    SEARCH_SHIPMENT_LOADING,
    CONFIRM_SHIPMENT_LOADING,
    FILE_DOWNLOADING,
} from "./types";

export const setInventoryReceivedLoading = () => {
    return {
        type: INVENTORY_RECEIVED_LOADING
    }
}
export const setShipmentItemsLoading = () => {
    return {
        type: SHIPMENT_ITEMS_LOADING
    }
}
export const setSearchShipmentLoading = () => {
    return {
        type: SEARCH_SHIPMENT_LOADING
    }
}
export const setConfirmShipmentLoading = () => {
    return {
        type: CONFIRM_SHIPMENT_LOADING
    }
}

export const setFileDownloading = (receivedBytes, totalBytes) => {
    return {
        type: FILE_DOWNLOADING,
        payload: {
            receivedBytes,
            totalBytes
        }
    }
}