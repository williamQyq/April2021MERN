import { createContext } from "react";
import { io } from "socket.io-client";



export const SocketContext = createContext();

export const SocketProvider = (props) => {
    // const [value, setValue] = useState('')
    //client socket
    const socket = io('/', {
        'reconnection': true,
        'reconnectionDelay': 500,
        'reconnectionAttempts': 5
    });

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



