import { io, Socket } from "socket.io-client";


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket | null = null;

// Returns a singleton socket instance
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false, // we connect manually after user is known
    });
  }
  return socket;
}

export function connectSocket(_clerkUserId?: string) {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    // The registration will happen in the connect event listener in ChatPage.tsx
  }
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}