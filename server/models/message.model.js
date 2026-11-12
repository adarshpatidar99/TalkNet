import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
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

    // Delete this message only for selected users
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Delete this message for everyone
    isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
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

    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deliveredTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

// Group chat pagination index
messageSchema.index({
  chatId: 1,
  createdAt: -1,
  _id: -1,
});

// Private chat pagination index: sender → receiver
messageSchema.index({
  senderId: 1,
  receiverId: 1,
  createdAt: -1,
  _id: -1,
});

// Private chat pagination index: receiver → sender
messageSchema.index({
  receiverId: 1,
  senderId: 1,
  createdAt: -1,
  _id: -1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
