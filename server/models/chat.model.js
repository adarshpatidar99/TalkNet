import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    chatName: {
      type: String,
      trim: true,
      default: "Chat",
    },
  
    groupImage: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

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