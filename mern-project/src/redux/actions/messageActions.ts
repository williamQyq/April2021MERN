import { GET_MESSAGES, CLEAR_MESSAGES } from "./types.js";
import { ActionType } from "@src/redux/interface.js";

export const returnMessages = (msg: string, status: number, id: ActionType | undefined = undefined) => {
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