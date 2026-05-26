import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"], 
});

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);
  socket.emit("join-room", "room1");
});
                          
socket.on("user-joined", (userId) => {
  console.log("New user joined:", userId);
});
  
socket.on("code-updates", (code) => {
  console.log("Code updated:", code);
});                                      

setTimeout(() => {
  socket.emit("code-change", {
    roomId: "room1",
    code: "console.log('Hello');",
  });
}, 3000);

export default socket;
