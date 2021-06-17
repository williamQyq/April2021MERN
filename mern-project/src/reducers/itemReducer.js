import {GET_ITEMS, ADD_ITEM, DELETE_ITEM } from '../actions/types.js';

const initialState = {
    items:[

    ]
}

export default function (state  = initialState, action) {
    switch(action.type) {
        case GET_ITEMS:
            return {
                ...state
            }
    }
}