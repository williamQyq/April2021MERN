import {GET_CC_ITEMS,ITEMS_LOADING} from './actions/types';

const initialState = {
    cc_items:[],
    loading: false
}

export default function Reducer (state  = initialState, action) {
    switch(action.type) {
        case GET_CC_ITEMS: 
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        
        case ITEMS_LOADING:
            return {
                ...state,
                loading:true
            }
        default:
            return state;
    }
}