import { 
    GET_BB_ITEMS, 
    GET_BB_ITEM_DETAIL, 
    ITEMS_LOADING, 
    SET_TABLE_STATE,
} from './actions/types';

const initialState = {
    bb_items: [],
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
        case GET_BB_ITEM_DETAIL:
            return {
                ...state,
                itemDetail: action.payload,
                loading: false
            }
        case SET_TABLE_STATE:
            return {
                ...state,
                tableState: action.payload,
                loading: false
            }
        default:
            return state;
    }
}