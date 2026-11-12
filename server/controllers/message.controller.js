import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from '../middlewares/error.middleware.js'
import mongoose from "mongoose";
import Chat from "../models/chat.model.js";


export const voiceUpload = catchAsyncError(async(req, res, next) => {

      if (!req.files || !req.files.audio) {
          return next(new ErrorHandler("No audio uploaded", 400));
      }

      const audioFile = req.files.audio;

      const result = await cloudinary.uploader.upload(audioFile.tempFilePath, {
          resource_type: "video",
          folder: "voice_messages"
      })

      if(!result) {
        return next(new ErrorHandler("failed to upload audio on cloudinary", 400));
      }

      return res.status(200).json({
        success: true,
        url: result.secure_url   
      })

});


export const videoUpload = catchAsyncError(async (req, res, next) => {

    if (!req.files || !req.files.video) {
      return next(new ErrorHandler("No video uploaded", 400));
    }

    const videoFile = req.files.video;

    const result = await cloudinary.uploader.upload(
      videoFile.tempFilePath,
      {
        resource_type: "video",       
        folder: "video_messages",   
      }
    );

    if (!result || !result.secure_url) {
      return next(new ErrorHandler("Failed to upload video on Cloudinary", 400));
    }

    return res.status(200).json({
      success: true,
      url: result.secure_url,        // frontend will get this URL
    });
                             
});


// GENERATE SIGNED VIDEO UPLOAD PARAMETERS
export const getVideoUploadSignature = catchAsyncError(
  async (req, res, next) => {
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder: "video_messages",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json({
      success: true,
      timestamp,
      signature,
      folder: paramsToSign.folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  }
);


export const imageUpload = async (req, res) => {
  try {            
                  
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file found" });
    }

    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { folder: "chat_images" }
    );

    return res.status(200).json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const sendMessage = catchAsyncError(async (req, res, next) => {
  
    const { senderId, receiverId, content, image } = req.body;

    if (!senderId || !receiverId || !content ) {
      return next(new ErrorHandler("All fields are required", 400));
    }
                                  
    let imageUrl = "";

    if(image) {              
      const uploadImage = await cloudinary.v2.uploader.upload( 
        image, 
        { folder: "chat_images" } 
      )

      imageUrl = uploadImage.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      imageUrl,
      status: "sent"
    });                            

    return res.status(201).json({ success: true, message });

});


export const getMessage = catchAsyncError(async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user._id;

  // Validate receiver ID
  if (!mongoose.isValidObjectId(receiverId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid receiver ID.",
    });
  }

  // Pagination settings
  const pageSize = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 30, 1),
    50
  );

  const { before } = req.query;

  // Match both directions of the private conversation
  const conversationFilter = {
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  };

  // Only fetch messages visible to the logged-in user
  const filters = [
    conversationFilter,
    { deletedFor: { $ne: senderId } },
  ];

  // Apply cursor if requesting older messages
  if (before) {
    if (!mongoose.isValidObjectId(before)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message cursor.",
      });
    }

    const cursorMessage = await Message.findOne({
      _id: before,
      $and: [
        conversationFilter,
        { deletedFor: { $ne: senderId } },
      ],
    })
      .select("createdAt")
      .lean();

    if (!cursorMessage) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unavailable message cursor.",
      });
    }

    filters.push({
      $or: [
        { createdAt: { $lt: cursorMessage.createdAt } },
        {
          createdAt: cursorMessage.createdAt,
          _id: { $lt: cursorMessage._id },
        },
      ],
    });
  }

  // Fetch newest messages first
  const messages = await Message.find({
    $and: filters,
  })
    .populate("senderId", "name profilePic")
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize + 1)
    .lean();

  // Determine whether older messages exist
  const hasMore = messages.length > pageSize;

  // Keep only the requested page
  const pageMessages = messages.slice(0, pageSize);

  // Preserve deleted-for-everyone placeholders
  const safeMessages = pageMessages.map((message) => {
    if (!message.isDeletedForEveryone) {
      return message;
    }

    return {
      ...message,
      text: "",
      content: "",
      imageUrl: "",
      audioUrl: "",
      videoUrl: "",
      replyTo: null,
      deletedPlaceholder: "This message was deleted.",
    };
  });

  // Return messages in chronological order
  safeMessages.reverse();

  // The oldest message in this page becomes the next cursor
  const nextCursor =
    pageMessages.length > 0
      ? pageMessages[pageMessages.length - 1]._id
      : null;

  return res.status(200).json({
    success: true,
    messages: safeMessages,
    pagination: {
      hasMore,
      nextCursor,
      limit: pageSize,
    },
  });
});


export const getGroupMessage = catchAsyncError(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const { before, limit = 30 } = req.query;

  // 1. Validate chat ID
  if (!mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid chat ID.",
    });
  }

  // 2. Verify group exists
  const chat = await Chat.findById(chatId)
    .select("isGroupChat participants")
    .lean();

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({
      success: false,
      message: "Group chat not found.",
    });
  }

  // 3. Verify user is a group participant
  const isParticipant = chat.participants.some(
    (participantId) =>
      String(participantId) === String(userId)
  );

  if (!isParticipant) {
    return res.status(403).json({
      success: false,
      message: "You are not a participant in this group.",
    });
  }

  // 4. Validate pagination limit
  const pageSize = Math.min(
    Math.max(parseInt(limit, 10) || 30, 1),
    50
  );

  // 5. Base query
  const query = {
    chatId,
    deletedFor: { $ne: userId },
  };

  // 6. Cursor: find messages older than the supplied message
  if (before) {
    if (!mongoose.isValidObjectId(before)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination cursor.",
      });
    }

    const cursorMessage = await Message.findOne({
      _id: before,
      chatId,
      deletedFor: { $ne: userId },
    })
      .select("_id createdAt")
      .lean();

    if (!cursorMessage) {
      return res.status(400).json({
        success: false,
        message: "Pagination cursor not found.",
      });
    }

    query.$or = [
      {
        createdAt: { $lt: cursorMessage.createdAt },
      },
      {
        createdAt: cursorMessage.createdAt,
        _id: { $lt: cursorMessage._id },
      },
    ];
  }

  // 7. Fetch one extra message to determine whether older messages exist
  const fetchedMessages = await Message.find(query)
    .populate("senderId", "name profilePic")
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize + 1)
    .lean();

  const hasMore = fetchedMessages.length > pageSize;

  // 8. Keep only the requested number of messages
  const messages = fetchedMessages.slice(0, pageSize);

  // 9. Transform deleted messages
  const safeMessages = messages.map((message) => {
    if (!message.isDeletedForEveryone) {
      return message;
    }

    return {
      ...message,
      text: "",
      content: "",
      imageUrl: "",
      audioUrl: "",
      videoUrl: "",
      replyTo: null,
      deletedPlaceholder: "This message was deleted.",
    };
  });

  // 10. Reverse into chronological order for the chat UI
  safeMessages.reverse();

  // 11. Cursor for the next batch of older messages
  const nextCursor =
    safeMessages.length > 0
      ? safeMessages[0]._id
      : null;

  return res.status(200).json({
    success: true,
    messages: safeMessages,
    pagination: {
      hasMore,
      nextCursor,
      limit: pageSize,
    },
  });
});


export const messageSave = catchAsyncError(async (req, res, next) => {
  const { senderId, receiverId, text, imageUrl, videoUrl, audioUrl } = req.body;

  if (!senderId || !receiverId) {
    return next(new ErrorHandler("senderId and receiverId are required", 400));
  }

  const type =
    imageUrl ? "image" :
    videoUrl ? "video" :
    audioUrl ? "audio" : "text";

  const message = await Message.create({
    senderId,
    receiverId,
    text: text || "",
    imageUrl: imageUrl || "",
    videoUrl: videoUrl || "",
    audioUrl: audioUrl || "",
    type,
    status: "sent",
  });

  return res.status(201).json({
    success: true,
    message,
  });
});


export const deleteMessageForMe = catchAsyncError(
  async (req, res, next) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    // 1. Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return next(new ErrorHandler("Message not found", 404));
    }

    // 2. Verify that the user can access this message
    if (message.chatId) {
      const chat = await Chat.findById(message.chatId);

      if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
      }

      if (chat.isGroupChat) {
        const isParticipant = chat.participants.some(
          (participantId) => participantId.toString() === userId.toString()
        );

        if (!isParticipant) {
          return next(
            new ErrorHandler("You are not a participant of this group", 403)
          );
        }
      } else {
        const isParticipant =
          message.senderId.toString() === userId.toString() ||
          message.receiverId?.toString() === userId.toString();

        if (!isParticipant) {
          return next(
            new ErrorHandler("You cannot delete this message", 403)
          );
        }
      }
    } else {
      // One-to-one messages without a chatId
      const isParticipant =
        message.senderId.toString() === userId.toString() ||
        message.receiverId?.toString() === userId.toString();

      if (!isParticipant) {
        return next(
          new ErrorHandler("You cannot delete this message", 403)
        );
      }
    }

    // 3. Add the current user to deletedFor only once
    await Message.updateOne(
      { _id: messageId },
      { $addToSet: { deletedFor: userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Message deleted for you successfully",
      messageId,
    });
  }
);


export const clearGroupChatForMe = catchAsyncError(
  async (req, res, next) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    if (!chatId) {
      return next(new ErrorHandler("chatId is required", 400));
    }

    const chat = await Chat.findById(chatId);

    if (!chat || !chat.isGroupChat) {
      return next(new ErrorHandler("Group chat not found", 404));
    }

    const isMember = chat.participants.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!isMember) {
      return next(
        new ErrorHandler("You are not a member of this group", 403)
      );
    }

    const result = await Message.updateMany(
      { chatId, deletedFor: { $ne: userId } },
      { $addToSet: { deletedFor: userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Group chat cleared for you successfully",
      modifiedCount: result.modifiedCount,
    });
  }
);


export const clearOneToOneChat = catchAsyncError(
  async (req, res, next) => {
    const { receiverId } = req.params;
    const userId = req.user._id;

    if (!receiverId) {
      return next(new ErrorHandler("receiverId is required", 400));
    }

    if (userId.toString() === receiverId) {
      return next(
        new ErrorHandler("You cannot clear a chat with yourself", 400)
      );
    }

    // Hide all messages in this one-to-one conversation
    // only for the currently logged-in user.
    const result = await Message.updateMany(
      {
        $or: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
        chatId: null,
      },
      {
        $addToSet: { deletedFor: userId },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Chat cleared for you successfully",
      modifiedCount: result.modifiedCount,
    });
  }
);


export const deleteMessageForEveryone = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // 1. Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    // 2. Only the original sender can delete it
    if (String(message.senderId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages for everyone.",
      });
    }

    // 3. Prevent unnecessary repeated deletion
    if (message.isDeletedForEveryone) {
      return res.status(200).json({
        success: true,
        messageId: message._id,
        isDeletedForEveryone: true,
        message: "Message was already deleted.",
      });
    }

    // 4. Validate the conversation
    if (message.chatId) {
      // Group message
      const chat = await Chat.findById(message.chatId)
        .select("isGroupChat participants");

      if (!chat || !chat.isGroupChat) {
        return res.status(404).json({
          success: false,
          message: "Group chat not found.",
        });
      }

      const isParticipant = chat.participants.some(
        (participantId) =>
          String(participantId) === String(userId)
      );

      if (!isParticipant) {
        return res.status(403).json({
          success: false,
          message: "You are not a participant in this group.",
        });
      }
    } else {
      // Private one-to-one message
      if (
        !message.receiverId ||
        String(message.receiverId) === String(message.senderId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid private message.",
        });
      }
    }

    // 5. Persist deletion in MongoDB
    message.isDeletedForEveryone = true;
    message.deletedAt = new Date();

    await message.save();

    
    // 6. Notify both users / all group participants through Socket.IO
    const io = req.app.get("io");

    const payload = {
      messageId: String(message._id),
      senderId: String(message.senderId),
      receiverId: message.receiverId
        ? String(message.receiverId)
        : null,
      chatId: message.chatId
        ? String(message.chatId)
        : null,
      isGroupChat: Boolean(message.chatId),
      isDeletedForEveryone: true,
      deletedAt: message.deletedAt,
    };

    if (io) {
      if (message.chatId) {
        // Group message: notify everyone in the group room
        io.to(String(message.chatId)).emit(
          "messageDeletedForEveryone",
          payload
        );
      } else {
        // Private message: notify sender and receiver
        io.to(String(message.senderId)).emit(
          "messageDeletedForEveryone",
          payload
        );

        io.to(String(message.receiverId)).emit(
          "messageDeletedForEveryone",
          payload
        );
      }
    }

    // 7. Return the deletion state
    return res.status(200).json({
      success: true,
      messageId: message._id,
      isDeletedForEveryone: true,
      deletedAt: message.deletedAt,
      message: "Message deleted for everyone.",
    });

    
  } catch (error) {
    console.error("Delete message for everyone error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};
