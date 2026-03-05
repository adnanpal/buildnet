// src/pages/ChatPage.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
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
  const [, setUsersLoaded] = useState(false);
  const socketStatusRef = useRef<Map<string, "online" | "offline">>(new Map());

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

        // 🔥 IMPORTANT: Set initial user list but preserve existing socket status
        // Only update if users haven't been loaded yet
        setConnectedUsers((prev) => {
          if (prev.length > 0) {
            // Merge: keep socket status, update lastSeen
            return usersWithPresence.map((newUser) => {
              const existing = prev.find((u) => u.id === newUser.id);
              // Use socket ref as source of truth for online status
              const socketStatus = socketStatusRef.current.get(newUser.id);
              const status = (socketStatus || existing?.status || "offline") as "online" | "offline";
              
              return existing
                ? {
                    ...newUser,
                    status,
                    unread: existing.unread,
                  }
                : newUser;
            });
          } else {
            // First load: set users as offline, socket will update status
            return usersWithPresence;
          }
        });

        setUsersLoaded(true);
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
      console.log("📡 Received online users from socket:", onlineUserIds);
      
      // Track socket status in ref (this won't trigger re-renders)
      socketStatusRef.current.clear();
      onlineUserIds.forEach(id => {
        socketStatusRef.current.set(id, "online");
      });
      
      setConnectedUsers((prev) => {
        const updated = prev.map((u) => {
          const isOnline = onlineUserIds.includes(u.id);
          const statusChanged = u.status !== (isOnline ? "online" : "offline");
          if (statusChanged) {
            console.log(
              `👤 ${u.name} status: ${u.status} → ${isOnline ? "online" : "offline"}`
            );
          }
          return {
            ...u,
            status: isOnline ? ("online" as const) : ("offline" as const),
          };
        });
        return updated;
      });
    };

    // Set up listener BEFORE connecting (this ensures we catch all broadcasts)
    socket.on("online_users", handleOnlineUsers);

    // Function to register user (called on connect AND on effect mount if already connected)
    const registerUser = () => {
      console.log("📝 Registering user:", user.id);
      socket.emit("register", { clerkUserId: user.id });
    };

    const handleConnect = () => {
      console.log("🟢 Socket connected");
      registerUser();

      // Fallback: Request online users after a short delay to ensure we have it
      const timer = setTimeout(() => {
        console.log("⏰ Sending request_online_users as fallback");
        socket.emit("request_online_users");
      }, 500);

      return () => clearTimeout(timer);
    };

    const handleConnectError = (error: Error) => {
      console.error("❌ Socket connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    // Connect if not connected
    if (!socket.connected) {
      console.log("🔌 Starting socket connection...");
      socket.connect();
    } else {
      console.log("🔌 Socket already connected, registering user");
      registerUser();
    }

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
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