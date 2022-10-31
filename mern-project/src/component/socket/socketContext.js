import { createContext, useEffect } from "react";
import {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
} from "reducers/actions/types";
import { io } from "socket.io-client";

const socket = io();

export const SocketContext = createContext(socket);
export const socketType = {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
}
export const SocketProvider = (props) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log(`${socket.id} connected.\n`)
        })
        socket.on('reconnect', (attemp) => {
            console.log(`${socket.id} tried reconnect ${attemp}`)
        })
        socket.on('disconnect', () => {
            console.log(`socket disconnected.`)
            // socket.connect();
        })
        socket.on('connect_error', (err) => {
            console.log(`socket exception: ${err}`)
        })

        return () => socket.disconnect();
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



