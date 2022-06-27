import {
    GET_INVENTORY_RECEIVED_ITEMS,
    GET_SHIPMENT_ITEMS,
    INVENTORY_RECEIVED_LOADING,
    SHIPMENT_ITEMS_LOADING,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
    // GET_ITEM_SPEC,
} from './actions/types';

const initialState = {
    inventoryReceivedItems: [],
    inventoryReceivedLoading: false,
    needToShip: {
        items: [],
        itemsLoading: false
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
        case GET_SHIPMENT_ITEMS:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    items: action.payload,
                    itemsLoading: false
                }
            }
        case SHIPMENT_ITEMS_LOADING:
            return {
                ...state,
                needToShip: {
                    ...state.needToShip,
                    itemsLoading: false
                }
            }
        default:
            return state;
    }
}