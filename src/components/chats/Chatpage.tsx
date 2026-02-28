// src/pages/ChatPage.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chatui from "../chats/Chatui";
import { getSocket } from "../socket/socket";

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
  const [socketConnected, setSocketConnected] = useState(false);

  // Connect socket and track connection state
  useEffect(() => {
    if (!user) return;
    
    const socket = getSocket();
    
    // Set up connection/disconnect listeners only once
    const handleConnect = () => {
      console.log("✅ Socket connected");
      socket.emit("register", { clerkUserId: user.id });
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Connect if not already connected
    if (!socket.connected) {
      socket.connect();
      socket.emit("register", { clerkUserId: user.id });
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [user]);

  // Set up online_users listener ONLY after socket is connected
  useEffect(() => {
    if (!socketConnected || !user) return;

    const socket = getSocket();

    const handleOnlineUsers = (onlineUserIds: string[]) => {
      console.log("📡 Online users event:", onlineUserIds, "Current user:", user.id);
      
      // Filter out the current user from the online list
      const otherUsersOnline = onlineUserIds.filter(id => id !== user.id);
      
      setConnectedUsers((prev) =>
        prev.map((u) => ({
          ...u,
          status: otherUsersOnline.includes(u.id)
            ? "online"
            : "offline",
        }))
      );
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [socketConnected, user]);

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
            status: "offline" as const,
            lastSeen: null,
            unread: 0,
          };
        });

        const fromReceiver: User[] = asReceiver.data.data.map((item: any) => {
          const u = item.fromUser ?? item?.attributes?.fromUser;
          return {
            id: u?.clerkUserId ?? u?.attributes?.clerkUserId ?? "",
            name: u?.name ?? u?.attributes?.name ?? "Unknown",
            status: "offline" as const,
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