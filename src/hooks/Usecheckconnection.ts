import { useEffect, useState } from "react";
import axios from "axios";

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

type ConnectionState = {
    accepted: boolean | null;
    roomId: string | null;
};

export default function useCheckConnection(
    myClerkUserId: string | null,
    targetClerkUserId: string | null

){
    const [state,setState] = useState<ConnectionState>({  accepted: null, roomId: null});

    useEffect(()=>{

    if(!myClerkUserId || !targetClerkUserId) return;

    setState({ accepted: null, roomId: null });

    axios.get(`${SOCKET_SERVER}/check-connection`, {
        params: {
            userA: myClerkUserId,
            userB: targetClerkUserId}
    })
    .then((res)=>{

        setState({ accepted: res.data.accepted, roomId: res.data.roomId ?? null });

    })
    .catch(()=>{
        setState({ accepted: false, roomId: null });
    });
},[myClerkUserId, targetClerkUserId]);

    return state;
}