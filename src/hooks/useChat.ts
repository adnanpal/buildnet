import { useEffect, useRef, useState, useCallback } from "react";
import { getSocket } from "../components/socket/socket";

export type ChatMessage = {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type?: "chat";
};

type UseChatOptions = {
  clerkUserId: string;        // current user
  senderName: string;         // current user's display name
  targetClerkUserId: string;  // the other user
  isConnected: boolean;       // only activate if connection is accepted
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

  useEffect(() => {
    // Only connect to socket room if connection is accepted
    if (!isConnected || !clerkUserId || !targetClerkUserId) return;

    const socket = getSocket();

    // Join the private room for this pair
    socket.emit("join_chat", { clerkUserId, senderName, targetClerkUserId });

    // Receive full history on join
    socket.on("message_history", (history: ChatMessage[]) => {
      setMessages(history.map((m) => ({ ...m, type: "chat" })));
    });

    // Receive new message in real time
    socket.on("receive_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
    });

    // Typing indicator from the other user
    socket.on("user_typing", ({ senderName: name, isTyping }: { senderName: string; isTyping: boolean }) => {
      setTypingUser(isTyping ? name : "");
    });

    // Guard error: connection not accepted
    socket.on("chat_error", ({ message }: { message: string }) => {
      setChatError(message);
    });

    return () => {
      socket.off("message_history");
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("chat_error");
    };
  }, [clerkUserId, senderName, targetClerkUserId, isConnected]);

  // Send a message
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !isConnected) return;
      const socket = getSocket();
      socket.emit("send_message", { clerkUserId, senderName, targetClerkUserId, text });

      // Stop typing indicator
      if (isTypingRef.current) {
        socket.emit("typing", { clerkUserId, senderName, targetClerkUserId, isTyping: false });
        isTypingRef.current = false;
      }
    },
    [clerkUserId, senderName, targetClerkUserId, isConnected]
  );

  // Typing indicator — debounced, stops after 1.5s of no input
  const emitTyping = useCallback(() => {
    if (!isConnected) return;
    const socket = getSocket();

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { clerkUserId, senderName, targetClerkUserId, isTyping: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("typing", { clerkUserId, senderName, targetClerkUserId, isTyping: false });
    }, 1500);
  }, [clerkUserId, senderName, targetClerkUserId, isConnected]);

  return { messages, typingUser, chatError, sendMessage, emitTyping };
}