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

  // ─────────────────────────────────────────────
  // FETCH CONNECTED USERS
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchConnectedUsers = async () => {
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



        const fromSender = asSender.data.data.map((item: any) => {
          const u = item.toUser ?? item?.attributes?.toUser;
          return {
            id: u?.clerkUserId ?? "",
            name: u?.name ?? "Unknown",
            status: "offline" as const,
            lastSeen: null,
            unread: 0,
          };
        });

        const fromReceiver = asReceiver.data.data.map((item: any) => {
          const u = item.fromUser ?? item?.attributes?.fromUser;
          return {
            id: u?.clerkUserId ?? "",
            name: u?.name ?? "Unknown",
            status: "offline" as const,
            lastSeen: null,
            unread: 0,
          };
        });

        const all = [...fromSender, ...fromReceiver];

        const unique = all.filter(
          (u, i, arr) => u.id && arr.findIndex((x) => x.id === u.id) === i
        );


        const usersWithPresence = await Promise.all(
          unique.map(async (u) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_SOCKET_URL}/presence/${u.id}`
              );
              const data = await res.json();

              return {
                ...u,
                lastSeen: data.lastSeen,
              };
            } catch {
              return u;
            }
          })
        );



        // 🔥 IMPORTANT: Merge instead of overwrite
        setConnectedUsers((prev) =>
          usersWithPresence.map((newUser) => {
            const existing = prev.find((u) => u.id === newUser.id);

            return existing
              ? {
                ...newUser,
                status: existing.status,
              }
              : newUser;
          })
        );

        console.log("✅ Connected users loaded:", unique.length);
      } catch (err) {
        console.error("Failed to load connected users", err);
      }
    };

    fetchConnectedUsers();
  }, [user]);

  // ─────────────────────────────────────────────
  // SOCKET ONLINE STATUS HANDLER
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const handleOnlineUsers = (onlineUserIds: string[]) => {
      setConnectedUsers((prev) =>
        prev.map((u) => {
          const isOnline = onlineUserIds.includes(u.id);

          return {
            ...u,
            status: isOnline ? "online" : "offline",
          };
        })
      );
    };
    // Set up listener BEFORE connecting
    socket.on("online_users", handleOnlineUsers);

    // Function to register user (called on connect AND on effect mount if already connected)
    const registerUser = () => {
      console.log("📝 Registering user:", user.id);
      socket.emit("register", { clerkUserId: user.id });
    };

    const handleConnect = () => {
      console.log("🟢 Socket connected");
      registerUser();
    };

    socket.on("connect", handleConnect);

    // Connect if not connected
    if (!socket.connected) {
      socket.connect();
    } else {
      // If already connected, emit register immediately
      registerUser();
    }

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect", handleConnect);
    };
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