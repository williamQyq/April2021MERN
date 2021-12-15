import {
    GET_AMZ_PROD_PRICING,
    AMAZON_RES_LOADING,
} from './actions/types';

const initialState = {
    res: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_AMZ_PROD_PRICING:
            return {
                ...state,
                res: action.payload,
                loading: false
            };
        case AMAZON_RES_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}