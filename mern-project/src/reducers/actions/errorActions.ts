import { ActionType } from 'reducers/interface';
import { GET_ERRORS, CLEAR_ERRORS } from './types.js';

//RETURN ERRORS
export const returnErrors = (msg: string, status: number, id: ActionType | undefined = undefined, reason: string | undefined = undefined) => {
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