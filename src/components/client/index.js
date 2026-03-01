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
  roomId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },  // clerkUserId
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

const presenceSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  lastSeen: { type: Date, default: null },
});

const Presence = mongoose.model("Presence", presenceSchema);

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
    // Proper AND grouping: (A→B) OR (B→A)
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

app.get("/presence/:userId", async (req, res) => {
  try {
    const record = await Presence.findOne({ clerkUserId: req.params.userId });
    res.json({ lastSeen: record?.lastSeen });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch presence" });
  }
});

// ─── Socket.IO ────────────────────────────────────────────────────────────────
// clerkUserId → socket.id
const onlineUsers = {} // clerkUserId -> socket.id

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Register user so we can track who is online
  socket.on("register", ({ clerkUserId }) => {
    socket.data.clerkUserId = clerkUserId;

    if (!onlineUsers[clerkUserId]) {
      onlineUsers[clerkUserId] = new Set();
    }

    onlineUsers[clerkUserId].add(socket.id);

    // Broadcast online users to all clients (each client will filter themselves out)
    io.emit("online_users", Object.keys(onlineUsers));
    console.log(`📡 Broadcasted online users:`, Object.keys(onlineUsers));
  });

  // Join a private chat room — GUARDED by Strapi connection check
  socket.on("join_chat", async ({ clerkUserId, senderName, targetClerkUserId }) => {


    if (socket.data.currentRoom) {
      console.log(`👋 Leaving previous room: ${socket.data.currentRoom}`);
      socket.leave(socket.data.currentRoom);
    }
    const accepted = await isConnectionAccepted(clerkUserId, targetClerkUserId);

    if (!accepted) {

      socket.emit("chat_error", {
        message: "You can only chat with accepted connections.",
      });
      return;
    }

    const roomId = buildRoomId(clerkUserId, targetClerkUserId);
    socket.join(roomId);
    socket.data.clerkUserId = clerkUserId;
    socket.data.senderName = senderName;
    socket.data.currentRoom = roomId;
    console.log(`✅ ${senderName} successfully joined room ${roomId}`);

    // Send message history
    const history = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
    socket.emit("message_history", history);


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
      senderId: clerkUserId,
      senderName,
      text: text.trim(),
      timestamp: new Date(),
    });

    io.to(roomId).emit("receive_message", {
      _id: message._id,
      roomId: message.roomId,
      senderId: message.senderId,
      senderName: message.senderName,
      text: message.text,
      timestamp: message.timestamp,
    });
  });

  // Typing indicator
  socket.on("typing", ({ clerkUserId, senderName, targetClerkUserId, isTyping }) => {

    const roomId = buildRoomId(clerkUserId, targetClerkUserId);

    socket.to(roomId).emit("user_typing", { senderName, isTyping, roomId });
  });

  socket.on("disconnect", async () => {
    const userId = socket.data.clerkUserId;
    if (!userId) return;

    onlineUsers[userId]?.delete(socket.id);

    if (onlineUsers[userId]?.size === 0) {
      delete onlineUsers[userId];

      //save lastseen in db
      await Presence.findOneAndUpdate(
        { clerkUserId: userId },
        { lastSeen: new Date() },
        { upsert: true }
      );
    }

    console.log(`👋 User disconnected: ${userId}`);
    io.emit("online_users", Object.keys(onlineUsers));
    console.log(`📡 Updated online users after disconnect:`, Object.keys(onlineUsers));
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Chat server running on http://localhost:${PORT}`));