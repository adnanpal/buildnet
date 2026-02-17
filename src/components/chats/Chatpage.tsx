// src/pages/ChatPage.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chatui from "../chats/Chatui";

type User = {
  id: string;
  name: string;
  status: "online" | "away" | "offline";
  lastSeen: string | null;
  unread: number;
};

export default function ChatPage() {
  const { user } = useUser();
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchConnected = async () => {
      try {
        const [asSender, asReceiver] = await Promise.all([
          api.get(
            `/api/connection-requests` +
              `?filters[fromUser][clerkUserId][$eq]=${user.id}` +
              `&filters[connectionStatus][$eq]=accepted` +
              `&populate[toUser][fields][0]=name` +
              `&populate[toUser][fields][1]=clerkUserId`
          ),
          api.get(
            `/api/connection-requests` +
              `?filters[toUser][clerkUserId][$eq]=${user.id}` +
              `&filters[connectionStatus][$eq]=accepted` +
              `&populate[fromUser][fields][0]=name` +
              `&populate[fromUser][fields][1]=clerkUserId`
          ),
        ]);

        const fromSender: User[] = asSender.data.data.map((item: any) => {
          const u = item.toUser ?? item?.attributes?.toUser;
          return {
            id: u?.clerkUserId ?? u?.attributes?.clerkUserId ?? "",
            name: u?.name ?? u?.attributes?.name ?? "Unknown",
            status: "online" as const,
            lastSeen: null,
            unread: 0,
          };
        });

        const fromReceiver: User[] = asReceiver.data.data.map((item: any) => {
          const u = item.fromUser ?? item?.attributes?.fromUser;
          return {
            id: u?.clerkUserId ?? u?.attributes?.clerkUserId ?? "",
            name: u?.name ?? u?.attributes?.name ?? "Unknown",
            status: "online" as const,
            lastSeen: null,
            unread: 0,
          };
        });

        // Deduplicate by id
        const all = [...fromSender, ...fromReceiver];
        const unique = all.filter(
          (u, i, arr) => u.id && arr.findIndex((x) => x.id === u.id) === i
        );

        setConnectedUsers(unique);
      } catch (err) {
        console.error("Failed to load connected users", err);
      }
    };

    fetchConnected();
  }, [user]);

  if (!user) return null;

  return (
    <Chatui
      currentUser={{
        clerkUserId: user.id,
        name: user.fullName ?? user.username ?? "You",
      }}
      connectedUsers={connectedUsers}
    />
  );
}