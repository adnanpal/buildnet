import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// ─── MongoDB ──────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://adnanpal:adnanpal90@buildnet.dpfox63.mongodb.net/?appName=Buildnet")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── Message Schema ───────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema({
  roomId:    { type: String, required: true, index: true },
  senderId:  { type: String, required: true },  // clerkUserId
  senderName:{ type: String, required: true },
  text:      { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// ─── Helper: build a stable roomId from two clerkUserIds ─────────────────────
// Sorting ensures A↔B and B↔A produce the same room
function buildRoomId(userIdA, userIdB) {
  return [userIdA, userIdB].sort().join("__");
}

// ─── Helper: verify connection is accepted in Strapi ─────────────────────────
async function isConnectionAccepted(clerkUserIdA, clerkUserIdB) {
  try {
    const STRAPI_URL = process.env.STRAPI_URL;
    const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

    // Check if an accepted connection exists between the two users (either direction)
    const res = await axios.get(
      `${STRAPI_URL}/api/connection-requests` +
        `?filters[$or][0][fromUser][clerkUserId][$eq]=${clerkUserIdA}` +
        `&filters[$or][0][toUser][clerkUserId][$eq]=${clerkUserIdB}` +
        `&filters[$or][1][fromUser][clerkUserId][$eq]=${clerkUserIdB}` +
        `&filters[$or][1][toUser][clerkUserId][$eq]=${clerkUserIdA}` +
        `&filters[connectionStatus][$eq]=accepted` +
        `&pagination[limit]=1`,
      { headers: { Authorization: `Bearer ${STRAPI_TOKEN}` } }
    );

    return res.data?.data?.length > 0;
  } catch (err) {
    console.error("Strapi connection check failed:", err.message);
    return false;
  }
}

// ─── REST: fetch message history for a room ───────────────────────────────────
app.get("/messages/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 })
      .limit(100);
    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ─── REST: check if two users are connected (used by frontend guard) ──────────
app.get("/check-connection", async (req, res) => {
  const { userA, userB } = req.query;
  if (!userA || !userB) return res.status(400).json({ error: "Missing userA or userB" });

  const accepted = await isConnectionAccepted(userA, userB);
  res.json({ accepted, roomId: accepted ? buildRoomId(userA, userB) : null });
});

// ─── Socket.IO ────────────────────────────────────────────────────────────────
const connectedUsers = {}; // clerkUserId → socket.id

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Register user so we can track who is online
  socket.on("register", ({ clerkUserId }) => {
    connectedUsers[clerkUserId] = socket.id;
    socket.data.clerkUserId = clerkUserId;
    console.log(`👤 Registered: ${clerkUserId}`);
  });

  // Join a private chat room — GUARDED by Strapi connection check
  socket.on("join_chat", async ({ clerkUserId, senderName, targetClerkUserId }) => {
    console.log(`🔄 join_chat event received: ${senderName} (${clerkUserId}) chatting with ${targetClerkUserId}`);

    if (socket.data.currentRoom){
      console.log(`👋 Leaving previous room: ${socket.data.currentRoom}`);
      socket.leave(socket.data.currentRoom);
    }
    const accepted = await isConnectionAccepted(clerkUserId, targetClerkUserId);

    if (!accepted) {
      console.log(`❌ Connection not accepted between ${clerkUserId} and ${targetClerkUserId}`);
      socket.emit("chat_error", {
        message: "You can only chat with accepted connections.",
      });
      return;
    }

    const roomId = buildRoomId(clerkUserId, targetClerkUserId);
    socket.join(roomId);
    socket.data.clerkUserId = clerkUserId;
    socket.data.senderName  = senderName;
    socket.data.currentRoom = roomId;
    console.log(`✅ ${senderName} successfully joined room ${roomId}`);

    // Send message history
    const history = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
    socket.emit("message_history", history);

    console.log(`💬 ${senderName} joined room ${roomId}`);
  });

  // Send a message — also re-checked so it can't be bypassed
  socket.on("send_message", async ({ clerkUserId, senderName, targetClerkUserId, text }) => {
    const roomId = buildRoomId(clerkUserId, targetClerkUserId);

    // Double-check connection is still accepted
    const accepted = await isConnectionAccepted(clerkUserId, targetClerkUserId);
    if (!accepted) {
      socket.emit("chat_error", { message: "Connection not accepted." });
      return;
    }

    if (!text?.trim()) return;

    const message = await Message.create({
      roomId,
      senderId:   clerkUserId,
      senderName,
      text:       text.trim(),
      timestamp:  new Date(),
    });

    io.to(roomId).emit("receive_message", {
      _id:        message._id,
      roomId:     message.roomId,
      senderId:   message.senderId,
      senderName: message.senderName,
      text:       message.text,
      timestamp:  message.timestamp,
    });
  });

  // Typing indicator
  socket.on("typing", ({ clerkUserId, senderName, targetClerkUserId, isTyping }) => {
    console.log(`🎹 Received typing event: ${senderName} (${isTyping ? 'typing' : 'stopped typing'})`);
    const roomId = buildRoomId(clerkUserId, targetClerkUserId);
    console.log(`📤 Broadcasting user_typing to room: ${roomId}, isTyping: ${isTyping}`);
    socket.to(roomId).emit("user_typing", { senderName, isTyping, roomId });
  });

  socket.on("disconnect", () => {
    const uid = socket.data.clerkUserId;
    if (uid) delete connectedUsers[uid];
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Chat server running on http://localhost:${PORT}`));