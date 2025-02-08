import {useEffect, useState} from 'react';
import * as dotenv from "dotenv";

dotenv.config();

const WS_URL = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080";
// const WS_URL = "https://plankton-app-4aum5.ondigitalocean.app"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    
    useEffect(()=>{
        const ws = new WebSocket(WS_URL); //Initializing the websocket client
        ws.onopen = () => {
            setSocket(ws); //If the websocket client is open then set socket state to the websocket client
        }

        ws.onclose = () => {
            setSocket(null); //If the websocket client is close then set socket state to null
        }

        // return () => {
        //     ws.close();
        // }
    }, [])

    return socket;
}
