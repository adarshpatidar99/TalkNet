import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

const onlineUsers = new Map();

export default function socketHandler(io) {
  io.on("connection", (socket) => {

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
  try {                           
    onlineUsers.set(String(userId), socket.id);

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });                    

    // Get all groups of this user
    const chats = await Chat.find({
      participants: userId,
      isGroupChat: true,
    });

    for (const chat of chats) {

      // Join socket room
      socket.join(chat._id.toString());

      // Find all messages that this user has NOT received yet
      const messages = await Message.find({
        chatId: chat._id,
        senderId: { $ne: userId },          // don't deliver own messages
        deliveredTo: { $ne: userId },       // not delivered yet
      });

      for (const message of messages) {

        // Add current user to deliveredTo
        message.deliveredTo.addToSet(userId);

        const totalReceivers = chat.participants.length - 1;

        // Everyone received?
        if (message.deliveredTo.length >= totalReceivers) {
          message.status = "delivered";
        }

        await message.save();

        // Notify everyone in group
        io.to(chat._id.toString()).emit(
          "group-message-delivered-update",
          {
            messageId: message._id,
            deliveredTo: message.deliveredTo,
            status: message.status,
          }
        );
      }
    }

    io.emit(
      "updateOnlineUsers",
      Array.from(onlineUsers.keys())
    );

  } catch (error) {
    console.log("userOnline error:", error);
  }
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
      ({ chatId, fromUserId, userName }) => {
        socket.to(chatId).emit(  
          "group-userTyping",
          {
            fromUserId,   
            chatId,
            userName
          }
        );
      }    
    );
   
    socket.on(
      "group-stop-typing", 
      ({ chatId, fromUserId, userName }) => {
        socket.to(chatId).emit(
          "group-stop-userTyping",
          {
            fromUserId,
            chatId,
            userName
          }
        );
      }
    );          

    // ================= PRIVATE MESSAGE =================
     socket.on("sendMessage", async (msg) => {
  try {
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
  } catch (error) {
    console.log("Send Message Error:", error);

    io.to(socket.id).emit(
      "messageStatusUpdated",
      {
        messageId: msg._id,
        status: "failed",
      }
    );
  }
     });
     
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

     socket.on("group-message-delivered", async ({ messageId, userId }) => {
  try {

    // Add user to deliveredTo
    await Message.findByIdAndUpdate(
      messageId,
      {
        $addToSet: {
          deliveredTo: userId,
        },
      }
    );

    let message = await Message.findById(messageId);

    const chat = await Chat.findById(message.chatId);

    const totalReceivers = chat.participants.length - 1;

    if (message.deliveredTo.length >= totalReceivers) {

      await Message.findByIdAndUpdate(
        messageId,
        {
          status: "delivered",
        }
      );

      message = await Message.findById(messageId);

      io.to(chat._id.toString()).emit(
        "group-message-delivered-update",
        {
          messageId,
          status: message.status,
        }
      );
    }

  } catch (error) {
    console.log("Group Delivered Error:", error);
  }
     });

    // ================= GROUP MESSAGE SEEN =================
    socket.on(
  "group-message-seen",
  async ({ messageId, userId }) => {
    try {

      // Add user to seenBy
      await Message.findByIdAndUpdate(
        messageId,
        {
          $addToSet: {
            seenBy: userId,
          },
        }
      );

      let updatedMessage = await Message.findById(messageId);

      const chat = await Chat.findById(updatedMessage.chatId);

      const totalReceivers = chat.participants.length - 1;

      // Everyone except sender has seen the message
      if (updatedMessage.seenBy.length >= totalReceivers) {

        await Message.findByIdAndUpdate(
          messageId,
          {
            status: "seen",
          }
        );

        updatedMessage = await Message.findById(messageId);
      }

      io.to(updatedMessage.chatId.toString()).emit(
        "group-message-seen-update",
        {
          messageId,
          seenBy: updatedMessage.seenBy,
          status: updatedMessage.status,
        }
      );

    } catch (error) {
      console.log("Group Seen Error:", error);
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

    });
  });
}