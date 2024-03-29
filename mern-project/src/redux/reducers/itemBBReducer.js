import {
    GET_BB_ITEMS,
    ITEMS_LOADING_BB,
    BB_ITEMS_ONLINE_PRICE_LOADING,
    ADD_BB_ITEM_SPEC,
    GET_BB_MOST_VIEWED_ITEMS,
    GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS,
    MOST_VIEWED_ITEMS_LOADING,
    GET_BB_ALSO_BOUGHT_ITEMS,
    GET_BESTBUY_API_ERRORS,
    GET_BB_ITEMS_ONLINE_PRICE,
    CLEAR_BESTBUY_ERRORS,
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE
} from '../actions/types.js';

const initialState = {
    items: [],
    loading: false,
    onlinePriceLoading:false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_BB_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case ITEMS_LOADING_BB:
            return {
                ...state,
                loading: true
            }
        case GET_BB_ITEMS + "_ERROR":
            return {
                ...state,
                items: [],
                loading: false
            }
        case BB_ITEMS_ONLINE_PRICE_LOADING:
            return {
                ...state,
                onlinePriceLoading: true
            }
        case MOST_VIEWED_ITEMS_LOADING:
            return {
                ...state,
                mostViewedItemsLoading: true
            }
        case ADD_BB_ITEM_SPEC:
            return {
                ...state,
                loading: false
            }
        case GET_BB_MOST_VIEWED_ITEMS:
            return {
                ...state,
                mostViewedItems: [...action.payload],
                mostViewedItemsLoading: false
            }
        case GET_BB_VIEWED_ULTIMATELY_BOUGHT_ITEMS:
            return {
                ...state,
                mostViewedItems: action.payload,
                mostViewedItemsLoading: false
            }
        case GET_BB_ALSO_BOUGHT_ITEMS:
            return {
                ...state,
                mostViewedItems: action.payload,
                mostViewedItemsLoading: false
            }
        case GET_BESTBUY_API_ERRORS:
            return {
                ...state,
                mostViewedItems: [],
                mostViewedItemsLoading: false
            }
        case GET_BB_ITEMS_ONLINE_PRICE:
            return {
                ...state,
                onlinePriceLoading: false
            }
        case ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE:
            return {
                ...state,
                onlinePriceLoading: false
            }
        case CLEAR_BESTBUY_ERRORS:
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