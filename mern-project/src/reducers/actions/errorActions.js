import { GET_ERRORS, CLEAR_ERRORS } from './types.js';

//RETURN ERRORS
export const returnErrors = (msg, status, id = null, reason = null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id, reason }
    };
};

//CLEAR ERRORS
export const clearErrors = (clearErrorsType = CLEAR_ERRORS) => {
    return {
        type: clearErrorsType
    };
};