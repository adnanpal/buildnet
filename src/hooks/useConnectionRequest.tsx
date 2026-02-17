import { useEffect, useState } from "react";
import api from "../api/axios";

export type connectionRequests = {
    id: string; // Strapi v5 uses documentId (string) for REST routes
    sender: {
        name: string;
        avatar: string;
        clerkUserId: string;
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
                    `&populate[fromUser][fields][0]=name` +
                    `&populate[fromUser][fields][1]=clerkUserId`
                );

                console.debug("connection-requests response", res.data);
                const formatted = res.data.data.map((item: any) => {
                    // prefer documentId (Strapi v5 REST identifier)
                    const documentId =
                        item.documentId ??
                        item?.attributes?.documentId ??
                        (item.id !== undefined ? String(item.id) : undefined);

                    const fromUserRaw =
                        item.fromUser ??
                        item?.attributes?.fromUser ??
                        item?.attributes?.fromUser?.data ??
                        null;

                    const name =
                        fromUserRaw?.name ??
                        fromUserRaw?.attributes?.name ??
                        fromUserRaw?.data?.attributes?.name ??
                        "Unknown";

                    const senderClerkUserId =
                        fromUserRaw?.clerkUserId ??
                        fromUserRaw?.attributes?.clerkUserId ??
                        fromUserRaw?.data?.attributes?.clerkUserId ??
                        "";

                    const avatar =
                        fromUserRaw?.avatar ??
                        fromUserRaw?.attributes?.avatar ??
                        name.charAt(0).toUpperCase();

                    return {
                        id: documentId,
                        sender: {
                            name,
                            avatar,
                            clerkUserId: senderClerkUserId,
                        },
                    };
                });

                setRequests(formatted);
            } catch (err) {
                console.error("Failed To Fetch Connection Requests", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

    }, [clerkUserId]);

    return { requests, loading, setRequests };
}
