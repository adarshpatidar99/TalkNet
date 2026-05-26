// server.js (main entry)
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Must come first

import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import socketHandlers from "./socket/socketHandlers.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Pass io to socket handler
socketHandlers(io);

const PORT = process.env.PORT || 7000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
