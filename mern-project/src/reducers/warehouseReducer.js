import {
    GET_INVENTORY_RECEIVED_ITEMS,
    INVENTORY_RECEIVED_LOADING,
    SYNC_INVENTORY_RECEIVED_WITH_GSHEET
    // GET_ITEM_SPEC,
} from './actions/types';

const initialState = {
    inventoryReceivedItems: [],
    inventoryReceivedLoading: false
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
        default:
            return state;
    }
}