import {
    GET_WM_ITEMS,
    ITEMS_LOADING_WM,
    ADD_WM_ITEM_SPEC,
} from '../actions/types.js';

const initialState = {
    items: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_WM_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };

        case ITEMS_LOADING_WM:
            return {
                ...state,
                loading: true
            }
        case ADD_WM_ITEM_SPEC:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}