// Load environment variables first (required before anything else)
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import socketHandlers from "./socket/socketHandlers.js";

// Create raw HTTP server (required for Socket.IO integration)
const httpServer = http.createServer(app);

// Initialize Socket.IO with CORS config for frontend connection
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// Initialize all socket event handlers
socketHandlers(io);

// Start server
const PORT = process.env.PORT || 7000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});







