import { GET_ERRORS, CLEAR_ERRORS, GET_MESSAGES, CLEAR_MESSAGES } from './actions/types.js';

const initialState = {
    msg: {},
    status: null,
    id: null
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id,
                reason: action.payload.reason
            };
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null
            };
        case GET_MESSAGES:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            };
        case CLEAR_MESSAGES:
            return {
                msg: {},
                status: null,
                id: null
            }
        default:
            return state;
    }
}
