import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../components/socket/socket";

export type ChatMessage = {
  _id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type?: "chat";
};

type UseChatOptions = {
  clerkUserId: string;
  senderName: string;
  targetClerkUserId: string;
  isConnected: boolean;
};

export default function useChat({
  clerkUserId,
  senderName,
  targetClerkUserId,
  isConnected,
}: UseChatOptions) {

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string>("");
  const [chatError, setChatError] = useState<string | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // ✅ MUST MATCH BACKEND EXACTLY
  const roomId =
    clerkUserId && targetClerkUserId
      ? [clerkUserId, targetClerkUserId].sort().join("__")
      : null;

  // 🔥 Reset when room changes
  useEffect(() => {
    setMessages([]);
    setTypingUser("");
  }, [roomId]);

  useEffect(() => {
    if (!isConnected || !roomId) {
      console.log("❌ useEffect skipped: isConnected=", isConnected, "roomId=", roomId);
      return;
    }

    const socket = getSocket();
    console.log("🔗 Setting up chat listeners for roomId:", roomId);

    socket.emit("join_chat", {
      clerkUserId,
      senderName,
      targetClerkUserId,
    });

    const handleHistory = (history: ChatMessage[]) => {
      
      setMessages(history.map((m) => ({ ...m, type: "chat" })));
    };

    const handleMessage = (msg: ChatMessage) => {
      
      if (msg.roomId !== roomId) return;
      setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
    };

    const handleTyping = (data: any) => {
      
      if (data.roomId !== roomId) {
        console.log("❌ Room ID mismatch. Event roomId:", data.roomId, "Current roomId:", roomId);
        return;
      }
      console.log("✅ Setting typingUser to:", data.isTyping ? data.senderName : "");
      setTypingUser(data.isTyping ? data.senderName : "");
    };

    const handleError = ({ message }: { message: string }) => {
      console.log("❌ Chat error:", message);
      setChatError(message);
    };

    socket.on("message_history", handleHistory);
    socket.on("receive_message", handleMessage);
    socket.on("user_typing", handleTyping);
    socket.on("chat_error", handleError);

    

    return () => {
      
      socket.off("message_history", handleHistory);
      socket.off("receive_message", handleMessage);
      socket.off("user_typing", handleTyping);
      socket.off("chat_error", handleError);
    };
  }, [roomId, isConnected, clerkUserId, senderName, targetClerkUserId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !isConnected || !roomId) return;

      const socket = getSocket();

      socket.emit("send_message", {
        clerkUserId,
        senderName,
        targetClerkUserId,
        text,
      });

      if (isTypingRef.current) {
        socket.emit("typing", {
          clerkUserId,
          senderName,
          targetClerkUserId,
          isTyping: false,
        });
        isTypingRef.current = false;
      }
    },
    [clerkUserId, senderName, targetClerkUserId, isConnected, roomId]
  );

  const emitTyping = useCallback(() => {
    if (!isConnected || !roomId) {
      console.log("❌ emitTyping blocked: isConnected=", isConnected, "roomId=", roomId);
      return;
    }

    const socket = getSocket();
    
    if (!socket.connected) {
      console.log("❌ Socket not connected");
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      console.log("📝 Sending typing: true to targetClerkUserId:", targetClerkUserId);
      socket.emit("typing", {
        clerkUserId,
        senderName,
        targetClerkUserId,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    
      socket.emit("typing", {
        clerkUserId,
        senderName,
        targetClerkUserId,
        isTyping: false,
      });
    }, 1500);
  }, [clerkUserId, senderName, targetClerkUserId, isConnected, roomId]);

  return { messages, typingUser, chatError, sendMessage, emitTyping };
}