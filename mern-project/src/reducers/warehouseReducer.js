import {
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
    GET_SHIPMENT_ITEMS_WITH_LIMIT,
    GET_SHIPPED_NOT_VERIFIED_SHIPMENT,
    INVENTORY_RECEIVED_LOADING,
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
        shippedNotVerifiedItems: []
    }
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case SYNC_INVENTORY_RECEIVED_WITH_GSHEET:
            return {
                ...state,
                inventoryReceivedLoading: false,
            };
        case GET_INVENTORY_RECEIVED_ITEMS:
            return {
                ...state,
                inventoryReceivedItems: action.payload,
                inventoryReceivedLoading: false
            }
        case INVENTORY_RECEIVED_LOADING:
            return {
                ...state,
                inventoryReceivedLoading: true
            };
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
        case SHIPMENT_ITEMS_LOADING:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    itemsLoading: true
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
        default:
            return Object.assign({}, state, {
                needToShip: Object.assign({}, state.needToShip)
            });
    }
}