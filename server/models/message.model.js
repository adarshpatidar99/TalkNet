import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ IMPORTANT
      ref: "User",
      required: true,
    },

    chatId: {
      
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",      
    },

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []  
      }
    ],

    replyTo: { 
       type: mongoose.Schema.Types.ObjectId,
       ref: "Message", 
       default: null  
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // ✅ IMPORTANT
      ref: "User",
      default: null
    },
                                                              
    text: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "audio", "video"],
      default: "text",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    reactions: [
       {
         userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
         },
         emoji: {
          type: String
         },
       }, 
    ],

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent", // sent
    },
  },                            
  {
    timestamps: true, // ✅ replaces createdAt
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
