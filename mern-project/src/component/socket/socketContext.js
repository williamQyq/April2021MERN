import { createContext, useState } from "react";
import {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_BB_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_MS_ITEMS_ONLINE_PRICE
} from "reducers/actions/types";
import { io } from "socket.io-client";

const socket = io('ws://localhost:3000')
export const SocketContext = createContext(socket);
export const socketType = {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_BB_ITEMS_ONLINE_PRICE,
    FAILED_RETRIEVE_MS_ITEMS_ONLINE_PRICE
}
export const SocketProvider = (props) => {
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



