import React, { useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = React.createContext<{ socket?: Socket }>({});

interface SocketProviderProps {
    children: React.ReactNode;
}
export const SocketProvider: React.FC<SocketProviderProps> = (props) => {
    const socketRef = React.useRef<Socket>();
    const [socket, setSocket] = React.useState<Socket | null>(null);
    useEffect(() => {
        const newSocket: Socket = io()
        setSocket(newSocket);
        socketRef.current = newSocket;
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
            if (socketRef.current || socket) {
                socketRef.current?.close();
                socket?.close();
            }
        };
    }, [])
    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {props.children}
        </SocketContext.Provider>
    );
}



