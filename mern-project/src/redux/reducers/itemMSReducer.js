import {
    CLEAR_MICROSOFT_ERRORS,
    GET_MS_ITEMS,
    GET_MS_ITEMS_ONLINE_PRICE,
    ITEMS_LOADING_MS,
    MS_ITEMS_ONLINE_PRICE_LOADING,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
} from '../actions/types.js';

const initialState = {
    items: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_MS_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case ITEMS_LOADING_MS:
            return {
                ...state,
                loading: true
            };
        case MS_ITEMS_ONLINE_PRICE_LOADING:
            return {
                ...state,
                onlinePriceLoading: true
            }
        case GET_MS_ITEMS_ONLINE_PRICE:
            return {
                ...state,
                onlinePriceLoading: false
            }
        case ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE:
            return {
                ...state,
                onlinePriceLoading: false
            }
        case CLEAR_MICROSOFT_ERRORS:
            return {
                ...state,
                loading: false,
                mostViewedItemsLoading: false,
                onlinePriceLoading: false
            }
        default:
            return state;
    }
}