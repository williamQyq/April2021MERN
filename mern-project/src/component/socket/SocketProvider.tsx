import React, { createContext, useEffect } from "react";
import {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
} from "@src/redux/actions/types";
import { Socket, io } from "socket.io-client";

export const SocketContext = createContext<Socket | undefined>(undefined);
export const socketType = {
    ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE,
    ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE,
    RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR,
    RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR
}
interface SocketProviderProps {
    children: React.ReactNode;
}
export const SocketProvider: React.FC<SocketProviderProps> = (props) => {
    const socketRef = React.useRef<Socket>();
    useEffect(() => {
        const socket: Socket = io();
        socketRef.current = socket;
        socketRef.current.on('connect', () => {
            console.log(`${socketRef.current!.id} connected.\n`)
        })
        socketRef.current.on('reconnect', (attemp) => {
            console.log(`${socketRef.current!.id} tried reconnect ${attemp}`)
        })
        socketRef.current.on('disconnect', () => {
            console.log(`socket disconnected.`)
            // socket.connect();
        })
        socketRef.current.on('connect_error', (err) => {
            console.log(`socket exception: ${err}`)
        })

        return () => {
            socketRef.current!.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={socketRef.current}>
            {props.children}
        </SocketContext.Provider>
    );
}



