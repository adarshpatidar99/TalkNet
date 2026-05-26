// import User from "../models/user.model.js";
// import Message from "../models/message.model.js";
// import Chat from '../models/chat.model.js';

// const onlineUsers = new Map();

// export default function socketHandler(io) {
//   io.on("connection", (socket) => {
//     console.log("⚡ User connected:", socket.id);

//     socket.on("joinChat", async (chatId) => {
//          socket.join(chatId);
//     });
                          

//     // ================= USER ONLINE =================
//     socket.on("userOnline", async (userId) => {
//       onlineUsers.set(String(userId), socket.id);
//       await User.findByIdAndUpdate(userId, { isOnline: true }).catch(() => {});

//       const chats = await Chat.find({
//         participants: userId,
//         isGroupChat: true
//       })

//       chats.forEach((chat) => {
//           socket.join(chat._id.toString());
//       })

//       io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
//     });



//     // ================= TYPING =================
//     socket.on("typing", ({ fromUserId, toUserId }) => {
//       const s = onlineUsers.get(String(toUserId));
//       if (s) io.to(s).emit("userTyping", { fromUserId });
//     });

//     socket.on("stop-typing", ({ fromUserId, toUserId }) => {
//       const s = onlineUsers.get(String(toUserId));
//       if (s) io.to(s).emit("stop-userTyping", { fromUserId });
//     });

    

//     socket.on("group-typing", async ({chatId, fromUserId}) => {

//        socket.to(chatId).emit("group-userTyping", {
//             fromUserId,
//             chatId       
//        })

//     })


//     socket.on("group-stop-typing", ({chatId, fromUserId}) => {

//        socket.to(chatId).emit("group-stop-userTyping", {
//           fromUserId, 
//           chatId
//        })

//     })


//     // ================= SEND MESSAGE =================
//     socket.on("sendMessage", async (msg) => {
//       const receiverSocket = onlineUsers.get(String(msg.receiverId));

//       if (receiverSocket) {
//         await Message.findByIdAndUpdate(msg._id, { status: "delivered" });

//         io.to(receiverSocket).emit("receiveMessage", {
//           ...msg,
//           status: "delivered",
//         });

//         io.to(socket.id).emit("messageStatusUpdated", {
//           messageId: msg._id,
//           status: "delivered",
//         });
//       } else {
//         io.to(socket.id).emit("messageStatusUpdated", {
//           messageId: msg._id,
//           status: "sent",
//         });
//       }
//     });

    
//     socket.on("leaveChat", (chatId) => {
//        socket.leave(chatId);
//     })
   

//     socket.on("sendGroupMessage", async (msg) => {
//        io.to(msg.chatId).emit("receiveGroupMessage", msg);

//       const chat = await Chat.findById(msg._id);

//       if(!chat) {
//          return;
//       }

//       const isMember = chat.participants.include(msg.senderId);

//       if(!isMember) {
//          return;
//       }

//       const fullName = await Message.findById(msg._id)
//       .populate("senderId", "name profilePic")
//       .populate("chatId");

//       io.to(msg.chatId).emit(
//         "receiveGroupMessage",
//         fullName
//       )

//     })

//     socket.on("group-message-seen", async({messageId, userId}) => {

//           await Message.findByIdAndUpdate(messageId, 
//             { 
//               $addToSet: {
//                  seenBy: userId
//               }
//              })       
//     })


//     socket.on("deleteGroupMessage", async({messageId, chatId}) => {
       
//         await Message.findByIdAndDelete(messageId);

//         io.to(chatId).socket.emit("groupMessageDeleted", {
//            messageId
//         });
        

//     })


//     // ================= MESSAGE SEEN =================
//     socket.on("message-seen", async ({ messageIds, senderId }) => {
//       await Message.updateMany(
//         { _id: { $in: messageIds } },
//         { status: "seen" }
//       );

//       const senderSocket = onlineUsers.get(String(senderId));
//       if (senderSocket) {
//         io.to(senderSocket).emit("messageStatusUpdated", {
//           messageIds,
//           status: "seen",
//         });
//       }
//     });

//     // ================= DELETE =================
//     socket.on("deleteMessage", async ({ messageId, receiverId }) => {
//       await Message.findByIdAndDelete(messageId);

//       io.to(socket.id).emit("messageDeleted", { messageId });

//       const rs = onlineUsers.get(String(receiverId));
//       if (rs) io.to(rs).emit("messageDeleted", { messageId });
//     });

   



//     // ================= DISCONNECT =================
//     socket.on("disconnect", async () => {
      

//       for (const [uid, sid] of onlineUsers.entries()) {
//         if (sid === socket.id) {
//           onlineUsers.delete(uid);
//           await User.findByIdAndUpdate(uid, { 
//             isOnline: false,
//             lastSeen: new Date()
//           }).catch(() => {}); 
//         }
//       }

//       io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
//     });
//   });
// }






import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

const onlineUsers = new Map();

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    // ================= JOIN CHAT ROOM =================
    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
    });

    // ================= LEAVE CHAT ROOM =================
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
    });

    // ================= USER ONLINE =================
    socket.on("userOnline", async (userId) => {
      onlineUsers.set(String(userId), socket.id);

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      }).catch(() => {});

      // Auto join all group chats
      const chats = await Chat.find({
        participants: userId,
        isGroupChat: true,
      });

      chats.forEach((chat) => {
        socket.join(chat._id.toString());
      });

      io.emit(
        "updateOnlineUsers",
        Array.from(onlineUsers.keys())
      );
    });

    // ================= PRIVATE TYPING =================
    socket.on(
      "typing",
      ({ fromUserId, toUserId }) => {
        const receiverSocket = onlineUsers.get(
          String(toUserId)
        );

        if (receiverSocket) {
          io.to(receiverSocket).emit(
            "userTyping",
            {
              fromUserId,
            }
          );
        }
      }
    );

    socket.on(
      "stop-typing",
      ({ fromUserId, toUserId }) => {
        const receiverSocket = onlineUsers.get(
          String(toUserId)
        );

        if (receiverSocket) {
          io.to(receiverSocket).emit(
            "stop-userTyping",
            {
              fromUserId,
            }
          );
        }
      }
    );

    // ================= GROUP TYPING =================
    socket.on(
      "group-typing",
      ({ chatId, fromUserId }) => {
        socket.to(chatId).emit(
          "group-userTyping",
          {
            fromUserId,
            chatId,
          }
        );
      }
    );

    socket.on(
      "group-stop-typing",
      ({ chatId, fromUserId }) => {
        socket.to(chatId).emit(
          "group-stop-userTyping",
          {
            fromUserId,
            chatId,
          }
        );
      }
    );

    // ================= PRIVATE MESSAGE =================
    socket.on("sendMessage", async (msg) => {
      const receiverSocket = onlineUsers.get(
        String(msg.receiverId)
      );

      if (receiverSocket) {
        await Message.findByIdAndUpdate(
          msg._id,
          {
            status: "delivered",
          }
        );

        io.to(receiverSocket).emit(
          "receiveMessage",
          {
            ...msg,
            status: "delivered",
          }
        );

        io.to(socket.id).emit(
          "messageStatusUpdated",
          {
            messageId: msg._id,
            status: "delivered",
          }
        );
      } else {
        io.to(socket.id).emit(
          "messageStatusUpdated",
          {
            messageId: msg._id,
            status: "sent",
          }
        );
      }
    });

    // ================= GROUP MESSAGE =================
    socket.on(
      "sendGroupMessage",
      async (msg) => {
        try {
          const chat = await Chat.findById(
            msg.chatId
          );

          if (!chat) {
            return;
          }

          // Validate sender is member
          const isMember =
            chat.participants.some(
              (participant) =>
                participant.toString() ===
                msg.senderId.toString()
            );

          if (!isMember) {
            return;
          }

          // Populate sender info
          const fullMessage =
            await Message.findById(msg._id)
              .populate(
                "senderId",
                "name profilePic"
              )
              .populate("chatId");

          // Update latest message
          await Chat.findByIdAndUpdate(
            msg.chatId,
            {
              latestMessage: msg._id,
              updatedAt: Date.now(),
            }
          );

          // Emit to room
          io.to(msg.chatId).emit(
            "receiveGroupMessage",
            fullMessage
          );
        } catch (error) {
          console.log(
            "Group Message Error:",
            error
          );
        }
      }
    );

    // ================= GROUP MESSAGE SEEN =================
    socket.on(
      "group-message-seen",
      async ({ messageId, userId }) => {
        try {
          await Message.findByIdAndUpdate(
            messageId,
            {
              $addToSet: {
                seenBy: userId,
              },
            }
          );
        } catch (error) {
          console.log(
            "Group Seen Error:",
            error
          );
        }
      }
    );

    // ================= DELETE GROUP MESSAGE =================
    socket.on(
      "deleteGroupMessage",
      async ({ messageId, chatId }) => {
        try {
          await Message.findByIdAndDelete(
            messageId
          );

          io.to(chatId).emit(
            "groupMessageDeleted",
            {
              messageId,
            }
          );
        } catch (error) {
          console.log(
            "Delete Group Message Error:",
            error
          );
        }
      }
    );

    // ================= PRIVATE MESSAGE SEEN =================
    socket.on(
      "message-seen",
      async ({ messageIds, senderId }) => {
        await Message.updateMany(
          {
            _id: { $in: messageIds },
          },
          {
            status: "seen",
          }
        );

        const senderSocket =
          onlineUsers.get(
            String(senderId)
          );

        if (senderSocket) {
          io.to(senderSocket).emit(
            "messageStatusUpdated",
            {
              messageIds,
              status: "seen",
            }
          );
        }
      }
    );

    // ================= DELETE PRIVATE MESSAGE =================
    socket.on(
      "deleteMessage",
      async ({ messageId, receiverId }) => {
        await Message.findByIdAndDelete(
          messageId
        );

        io.to(socket.id).emit(
          "messageDeleted",
          {
            messageId,
          }
        );

        const receiverSocket =
          onlineUsers.get(
            String(receiverId)
          );

        if (receiverSocket) {
          io.to(receiverSocket).emit(
            "messageDeleted",
            {
              messageId,
            }
          );
        }
      }
    );

    // ================= DISCONNECT =================
    socket.on("disconnect", async () => {
      for (const [
        userId,
        socketId,
      ] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          await User.findByIdAndUpdate(
            userId,
            {
              isOnline: false,
              lastSeen: new Date(),
            }
          ).catch(() => {});
        }
      }

      io.emit(
        "updateOnlineUsers",
        Array.from(onlineUsers.keys())
      );

      console.log(
        "❌ User disconnected:",
        socket.id
      );
    });
  });
}