import { createContext, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = (props) => {
    const initSocket = io('http://localhost:3000/')
    const [socket, setSocket] = useState(initSocket)
    socket.on('disconnect', (reason) => {
        console.warn(`reason:${reason} `, socket)
    })

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



