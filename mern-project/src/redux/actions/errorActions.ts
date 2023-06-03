import { ActionType } from '@src/redux/interface.js';
import { GET_ERRORS, CLEAR_ERRORS } from './types.js';

//RETURN ERRORS
export const returnErrors = (msg: string, status: number, errorId?: ActionType, reason?: string) => {
    errorId = errorId ? errorId + "_ERROR" : GET_ERRORS;
    return {
        type: errorId,
        payload: { msg, status, id: errorId, reason }
    };
};

//CLEAR ERRORS
export const clearErrors = (clearErrorsType = CLEAR_ERRORS) => {
    return {
        type: clearErrorsType
    };
};