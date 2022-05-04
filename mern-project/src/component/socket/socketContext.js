import { createContext,useState } from "react";
import { io } from "socket.io-client";



export const SocketContext = createContext();

export const SocketProvider = (props) => {
    const initSocket = io('/', {
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    })
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



