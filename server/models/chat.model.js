import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // Direct chat or group chat
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    // For group chats: "College Friends"
    // For direct chats: can remain "Chat"
    chatName: {
      type: String,
      trim: true,
      default: "Chat",
    },

    // Group avatar URL
    groupImage: {
      type: String,
      default: "",
    },

    // Optional group description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Users in the chat
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Last message sent in this chat
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Creator/admin of the group
    // Will be null for direct chats
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;