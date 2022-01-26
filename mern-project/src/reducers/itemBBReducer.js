import {
    GET_BB_ITEMS,
    ITEMS_LOADING,
    GET_ITEM_SPEC
} from './actions/types';

const initialState = {
    items: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_BB_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            };

        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            }
        case GET_ITEM_SPEC:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}