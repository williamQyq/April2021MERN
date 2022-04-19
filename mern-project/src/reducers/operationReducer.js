import {
    GET_AMZ_PROD_PRICING,
    UPLOAD_ASINS_MAPPING,
    PRODUCT_LIST_LOADING
    // GET_ITEM_SPEC,
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
                sellingPartner: [...action.payload],
                loading: false
            };

        case PRODUCT_LIST_LOADING:
            return {
                ...state,
                loading: true
            }
        case UPLOAD_ASINS_MAPPING:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}