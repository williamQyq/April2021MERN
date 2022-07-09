import { GET_MESSAGES, CLEAR_MESSAGES } from "./types.js";

export const returnMessages = (msg, status, id = null) => {
    return {
        type: GET_MESSAGES,
        payload: { msg, status, id }
    };
}

export const clearMessages = () => {
    return {
        type: CLEAR_MESSAGES
    }
}