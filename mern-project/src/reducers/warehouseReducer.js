import {
    CONFIRM_SHIPMENT,
    CONFIRM_SHIPMENT_LOADING,
    FILE_DOWNLOADED,
    FILE_DOWNLOADING,
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS_WITH_LIMIT,
    GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
    INVENTORY_RECEIVED_LOADING,
    SEARCH_LOCATION_INVENTORY,
    SEARCH_OUTBOUND_SHIPMENT,
    SEARCH_RECEIVAL_SHIPMENT,
    SEARCH_SELLER_INVENTORY,
    SEARCH_SHIPMENT_LOADING,
    SHIPMENT_ITEMS_LOADING,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
    // GET_ITEM_SPEC,
} from './actions/types';

const initialState = {
    inventoryReceived: {
        inventoryReceivedItems: [],
        inventoryReceivedLoading: false
    },
    needToShip: {
        items: [],
        itemsLoading: false,
        confirmLoading: false,
        shippedNotVerifiedItems: [],
        download: {
            isDownloading: false,
            receievedBytes: undefined,
            totalBytes: undefined,
        }
    },
    shipmentSearch: {
        items: [],
        itemsLoading: false
    }
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case SYNC_INVENTORY_RECEIVED_WITH_GSHEET:
            return {
                ...state,
                inventoryReceived: {
                    ...state.inventoryReceived,
                    inventoryReceivedLoading: false,
                }
            };
        case GET_INVENTORY_RECEIVED_ITEMS:
            return {
                ...state,
                inventoryReceived: {
                    inventoryReceivedItems: action.payload,
                    inventoryReceivedLoading: false
                }
            }
        case INVENTORY_RECEIVED_LOADING:
            return {
                ...state,
                inventoryReceived: {
                    ...state.inventoryReceived,
                    inventoryReceivedLoading: true
                }
            };
        case SEARCH_OUTBOUND_SHIPMENT:
        case SEARCH_RECEIVAL_SHIPMENT:
        case SEARCH_LOCATION_INVENTORY:
        case SEARCH_SELLER_INVENTORY:
            return {
                ...state,
                shipmentSearch: {
                    ...state.shipmentSearch,
                    items: action.payload,
                    itemsLoading: false,
                    category: action.type
                }
            }
        case GET_SHIPMENT_ITEMS_WITH_LIMIT:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    items: action.payload.shipment,
                    totalShipmentCount: action.payload.totalShipmentCount,
                    itemsLoading: false
                }
            }
        case SEARCH_SHIPMENT_LOADING:
            return {
                ...state,
                shipmentSearch: {
                    ...state.shipmentSearch,
                    itemsLoading: true,
                    // items: []
                }
            }
        case SHIPMENT_ITEMS_LOADING:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    itemsLoading: true
                }
            }
        case CONFIRM_SHIPMENT_LOADING:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    confirmLoading: true
                }
            }
        case CONFIRM_SHIPMENT:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    confirmLoading: false
                }
            }

        case GET_SHIPPED_NOT_VERIFIED_SHIPMENT:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    itemsLoading: false,
                    shippedNotVerifiedItems: action.payload
                }

            }
        case FILE_DOWNLOADED:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    download: {
                        ...state.needToShip.download,
                        isDownloading: false
                    }
                }
            }
        case FILE_DOWNLOADING:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    download: {
                        isDownloading: true,
                        receivedBytes: action.payload.receivedBytes,
                        totalBytes: action.payload.totalBytes
                    }
                }
            }

        default:
            return Object.assign({}, state, {
                needToShip: Object.assign({}, state.needToShip)
            });
    }
}