import { ActionType } from 'reducers/interface';
import { GET_ERRORS, CLEAR_ERRORS } from './types.js';

//RETURN ERRORS
export const returnErrors = (msg: string, status: number, errorId: ActionType | undefined = undefined, reason: string | undefined = undefined) => {
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