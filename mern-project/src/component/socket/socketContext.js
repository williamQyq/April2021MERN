import { createContext, useState } from "react";
import {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
} from "reducers/actions/types";
import { io } from "socket.io-client";

const socket = io('ws://localhost:3000', {
    reconnection: true,
    transportOptions: ["websocket"]
})
socket.on('connect', () => {
    console.log(`${socket.id} connected.\n`)
})
socket.on('reconnect', (attemp) => {
    console.log(`${socket.id} tried reconnect ${attemp}`)
})
export const SocketContext = createContext(socket);
export const socketType = {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
}
export const SocketProvider = (props) => {
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



