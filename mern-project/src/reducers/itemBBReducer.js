import {GET_BB_ITEMS,ITEMS_BB_LOADING} from './actions/types';

const initialState = {
    bb_items:[],
    loading: false
}

export default function Reducer (state  = initialState, action) {
    switch(action.type) {
        case GET_BB_ITEMS: 
            return {
                ...state,
                items: action.payload,
                loading: false
            };
        
        case ITEMS_BB_LOADING:
            return {
                ...state,
                loading:true
            }
        default:
            return state;
    }
}