import {
    GET_ITEMS,
    ADD_ITEM,
    DELETE_ITEM,
    ITEMS_LOADING,
    SET_TABLE_STATE,
    GET_MS_ITEM_DETAIL,
    GET_BB_ITEM_DETAIL,
    GET_MS_ITEMS_ONLINE_PRICE,
} from '../actions/types.js';

const initialState = {
    items: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            };
        case ADD_ITEM:
            return {
                ...state,
                items: [action.payload, ...state.items]
            };
        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            };
        case SET_TABLE_STATE:
            return {
                ...state,
                tableState: action.payload,
                loading: false
            };
        case GET_MS_ITEM_DETAIL:
            return {
                ...state,
                itemDetail: action.payload,
                loading: false
            };
        case GET_BB_ITEM_DETAIL:
            return {
                ...state,
                itemDetail: action.payload,
                loading: false
            };

        case GET_MS_ITEMS_ONLINE_PRICE:
            return {
                ...state,
                onlinePriceLoading: false
            }
        default:
            return state;
    }
}