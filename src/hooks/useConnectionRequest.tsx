import { useEffect, useState } from "react";
import api from "../api/axios";

export type connectionRequests = {
    id: number;
    sender: {
        name: string;
        avatar: string;
    };
};

export default function useConnectionRequests(

    clerkUserId: string | null

) {
    const [requests, setRequests] = useState<connectionRequests[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        if (!clerkUserId) {
            setLoading(false);
            return;
        }

        const fetchRequests = async () => {
            try {
                const res = await api.get(
                    `/api/connection-requests` +
                    `?filters[toUser][clerkUserId][$eq]=${clerkUserId}` +
                    `&filters[connectionStatus][$eq]=pending` +
                    `&populate[fromUser][fields][0]=name`
                );

                const formatted = res.data.data.map((item:any)=>({
                    id:item.id,
                    sender:{
                        name: item.fromUser.name,
                        avatar:item.fromUser.avatar ?? item.fromUser.name.charAt(0).toUpperCase(),
                    },
                }));
                
                setRequests(formatted);
            }catch(err){
                console.error("Failed To Fetch Connection Requests",err);
            }finally{
                setLoading(false);
            }

            fetchRequests();

        };
        fetchRequests();

    },[clerkUserId]);

    return{requests,loading,setRequests};
}
