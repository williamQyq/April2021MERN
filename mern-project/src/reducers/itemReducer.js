import {GET_ITEMS, ADD_ITEM, DELETE_ITEM} from './actions/types';

const initialState = {
    items:[
        { name: 'HP ENVY'},
    ]
}

export default function (state  = initialState, action) {
    switch(action.type) {
        case GET_ITEMS: 
            return {
                ...state
            }
        default:
            return state;
    }
}