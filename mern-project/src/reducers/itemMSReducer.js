import {
    GET_MS_ITEMS,
    ITEMS_LOADING,
} from './actions/types';

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
        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}