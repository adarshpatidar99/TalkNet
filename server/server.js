// Load environment variables first (required before anything else)
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import socketHandlers from "./socket/socketHandlers.js";

const httpServer = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://talknet-sooty.vercel.app",
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

socketHandlers(io);

const PORT = process.env.PORT || 7000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});







