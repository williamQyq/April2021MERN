import { GET_KEEPA_STAT, KEEPA_LOADING } from './actions/types';

const initialState = {
    keepa: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_KEEPA_STAT:
            return {
                ...state,
                keepa: action.payload,
                loading: false
            };
        case KEEPA_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}