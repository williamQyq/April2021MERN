import {
    INVENTORY_RECEIVED_LOADING,
    SHIPMENT_ITEMS_LOADING,
    SEARCH_SHIPMENT_LOADING,

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