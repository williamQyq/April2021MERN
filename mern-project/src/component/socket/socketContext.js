import { createContext} from "react";
import { io } from "socket.io-client";


//client socket
const socket = io('/', {
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 5
});
export const SocketContext = createContext();

export const SocketProvider = (props) => {
    // const [value, setValue] = useState('')


    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}



