import {
    GET_AMZ_PROD_PRICING,
    GET_UPC_ASIN_MAPPING,
    AMAZON_RES_LOADING,
} from './actions/types';

const initialState = {
    sellingPartner: [],
    loading: false
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_AMZ_PROD_PRICING:
            return {
                ...state,
                sellingPartner: action.payload,
                loading: false
            };
        case GET_UPC_ASIN_MAPPING:
            return {
                ...state,
                sellingPartner: action.payload,
                loading: false
            }


        case AMAZON_RES_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}