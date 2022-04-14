import { createContext, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

//client socket
export const socket = io('/', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 5
});

export const SocketProvider = (props) => {
    const [value, setValue] = useState('')

    
    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    );
}



