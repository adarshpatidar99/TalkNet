import Chat from "../models/chat.model.js";
import ErrorHandler from '../middlewares/error.middleware.js';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js'   
import Message from "../models/message.model.js"
import cloudinary from "../config/cloudinary.js";

// Access 1-to-1 chat
export const accessChat = catchAsyncError(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId)
    return next(new ErrorHandler("UserId is required", 400));

  let chat = await Chat.findOne({
    isGroupChat: false,
    participants: { $all: [req.user._id, userId] },
  })
    .populate("participants", "-password")
    .populate("latestMessage");

  if (!chat) {
    chat = await Chat.create({
      isGroupChat: false,
      participants: [req.user._id, userId],
    });

    chat = await Chat.findById(chat._id).populate(
      "participants",
      "-password"
    );
  }

  return res.status(200).json({ success: true, chat });
});


export const fetchChats = catchAsyncError(async (req, res, next) => {
  const chats = await Chat.find({
    participants: req.user._id,
  })
    .populate("participants", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "senderId",
        select: "name avatar",
      },
    })
    .sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    chats,
  });
});


export const createGroupChat = catchAsyncError(
  async (req, res, next) => {
    let { groupName, userIds } = req.body;

    // Parse userIds if string
    if (typeof userIds === "string") {
      userIds = JSON.parse(userIds);
    }

    if (
      !groupName ||
      !Array.isArray(userIds) ||
      userIds.length < 2
    ) {
      return next(
        new ErrorHandler(
          "Group name & at least 2 users required",
          400
        )
      );
    }

    // Add current user
    const participants = [
      ...new Set([
        ...userIds.map((id) => id.toString()),
        req.user._id.toString(),
      ]),
    ];
    let groupImageUrl = "";

    if (req.files?.groupImage) {
      const file = req.files.groupImage;

      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        {
          folder: "group_images",
          width: 300,
          crop: "scale",
        }
      );

      groupImageUrl = result.secure_url;
    }

    // CREATE GROUP
    const groupChat = await Chat.create({
      chatName: groupName,
      groupImage: groupImageUrl,
      isGroupChat: true,
      participants,
      groupAdmin: req.user._id,
    });

    // Populate
    const fullGroupChat = await Chat.findById(
      groupChat._id
    )
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");

    // REALTIME EVENT
    const io = req.app.get("io");

    participants.forEach((uid) => {
      io.to(uid.toString()).emit(
        "newGroupChat",
        fullGroupChat
      );
    });

    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      groupChat: fullGroupChat,
    });
  }
);


export const updateGroupDescription = async(req, res, next) => {

   const {chatId, description} = req.body;

   const group = await Chat.findById(chatId);
   if(!group) {
    return next (new ErrorHandler("Group not found", 404));
   }

   if(group.groupAdmin.toString() !== req.user._id.toString()) {
     return next (new ErrorHandler("Only admin can update description"));
   }

   group.description = description;

   await group.save();

   return res.status(200).json({
    success: true,
    group
   })

} 


export const addToGroup = catchAsyncError(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return next(
      new ErrorHandler(
        "ChatId and UserId are required",
        400
      )
    );
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(
      new ErrorHandler(
        "Chat not found",
        404
      )
    );
  }

  // Only admin can add users
  if (
    String(chat.groupAdmin) !==
    String(req.user._id)
  ) {
    return next(
      new ErrorHandler(
        "Only admin can add users",
        403
      )
    );
  }

  // Check if user already exists
  const alreadyMember = chat.participants.some(
    (participant) =>
      participant.toString() ===
      userId.toString()
  );

  if (alreadyMember) {
    return next(
      new ErrorHandler(
        "User already exists in this group",
        400
      )
    );
  }
                                    
  chat.participants.push(userId);

  await chat.save();

  const updatedChat = await Chat.findById(chatId)
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");

  const io = req.app.get("io");

  io.to(userId.toString()).emit(
    "addedToGroup",
    updatedChat
  );

  return res.status(200).json({
    success: true,
    chat: updatedChat,
  });
});


export const sendGroupMessage = catchAsyncError(
  async (req, res, next) => {
    const {
      chatId,
      text,
      type,
      imageUrl,
      audioUrl,
      videoUrl,
    } = req.body;

    if (!chatId) {
      return next(
        new ErrorHandler(
          "ChatId is required",
          400
        )
      );
    }

    // Validate message content
    if (
      !text &&
      !imageUrl &&
      !audioUrl &&
      !videoUrl                                      
    ) {
      return next(
        new ErrorHandler(
          "Message content is required",
          400                    
        )
      );
    }                 

    // Find group
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(
        new ErrorHandler(
          "Group chat not found",
          404
        )
      );
    }

    if (!chat.isGroupChat) {
      return next(
        new ErrorHandler(
          "Invalid group chat",
          400
        )
      );
    }

    // Check membership
    const isMember = chat.participants.some(
      (participant) =>
        participant.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return next(
        new ErrorHandler(
          "You are not a member of this group",
          403
        )
      );
    }

    // Create message
    const message = await Message.create({
      senderId: req.user._id,
      chatId,
      text,
      type: type || "text",
      status: "sent",
      imageUrl,
      audioUrl,
      videoUrl,
    });

    // Update latest message
    chat.latestMessage = message._id;
    await chat.save();

    // Populate sender details
    const populatedMessage =
      await Message.findById(message._id)
        .populate(
          "senderId",
          "name avatar"
        )
        .populate("chatId");

    // Socket event
    const io = req.app.get("io");

    io.to(chatId).emit(
      "newGroupMessage",
      populatedMessage
    );

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  }
);


export const getGroupMessage = catchAsyncError  (async (req, res, next) => {
  
     const {chatId} = req.params;

     if(!chatId) {
       return next (new ErrorHandler("chatId not found...", 404));
     }

     const chat = await  Chat.findById(chatId);

     if(!chat) {
       return next (new ErrorHandler("chat not found...", 404));
     }

     if(!chat.isGroupChat) {
       return next (new ErrorHandler("Invalid group chat", 400));
     }

     const isMember = chat.participants.some(
      (participant) => participant.toString() === 
       req.user._id.toString()
     );

     if(!isMember) {
       return next(new ErrorHandler("you are not a member of this group.", 403))
     }
 
     const message = await Message.find({
      chatId
     }).populate(
       "senderId",
       "name profilePic"
     )    
     .sort({ createdAt: 1});
     
     return res.status(200).json({
      success: true,
      count: message.length,
      messages: message,
     });
 
});
 

export const leaveGroup = catchAsyncError(
  async (req, res, next) => {
    const { chatId } = req.body;

    if (!chatId) {
      return next(
        new ErrorHandler(
          "ChatId is required",
          400
        )
      );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(
        new ErrorHandler(
          "Group not found",
          404
        )
      );
    }

    // User must be a member
    const isMember = chat.participants.some(
      (participant) =>
        participant.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return next(
        new ErrorHandler(
          "You are not a member of this group",
          400
        )
      );
    }

    // Prevent admin from leaving directly
    if (
      String(chat.groupAdmin) ===
      String(req.user._id)
    ) {
      return next(
        new ErrorHandler(
          "Group admin cannot leave. Transfer admin role first.",
          400
        )
      );
    }

    // Remove current user
    chat.participants = chat.participants.filter(
      (participant) =>
        participant.toString() !==
        req.user._id.toString()
    );

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");

    const io = req.app.get("io");

    io.to(chatId).emit(
      "userLeftGroup",
      {
        chatId,
        userId: req.user._id,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Left group successfully",
      chat: updatedChat,
    });
  }
);


export const deleteGroup = catchAsyncError(async (req, res, next) => {
  const { chatId } = req.body;

  if (!chatId) {
    return next(
      new ErrorHandler("ChatId is required", 400)
    );
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(
      new ErrorHandler("Group not found", 404)
    );
  }

  if (!chat.isGroupChat) {
    return next(
      new ErrorHandler("Invalid group chat", 400)
    );
  }

  if (String(chat.groupAdmin) !== String(req.user._id)) {
    return next(
      new ErrorHandler(
        "Only group admin can delete the group",
        403
      )
    );
  }

  // Delete group image from Cloudinary
  if (chat.groupImage) {
    const publicId = chat.groupImage
      .split("/")
      .pop()
      .split(".")[0];

    await cloudinary.uploader.destroy(
      `group_images/${publicId}`
    );
  }

  // Delete all messages of this group
  await Message.deleteMany({
    chatId,
  });

  // Delete group
  await Chat.findByIdAndDelete(chatId);

  // Notify all participants
  const io = req.app.get("io");

  chat.participants.forEach((participant) => {
    io.to(participant.toString()).emit(
      "groupDeleted",
      {
        chatId,
      }
    );
  });

  return res.status(200).json({
    success: true,
    message: "Group deleted successfully",
  });
});


export const removeFromGroup = catchAsyncError(
  async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return next(
        new ErrorHandler(
          "ChatId and UserId are required",
          400
        )
      );
    }

    // Find group
    const chat = await Chat.findById(chatId);
  
    if (!chat) {
      return next(
        new ErrorHandler(
          "Chat not found",
          404
        )
      );
    }
  
    // Only admin can remove users
    if (
      String(chat.groupAdmin) !==
      String(req.user._id)
    ) {
      return next(
        new ErrorHandler(
          "Only admin can remove users",
          403
        )
      );
    }

    // Prevent removing admin
    if (
      String(chat.groupAdmin) ===
      String(userId)
    ) {
      return next(
        new ErrorHandler(
          "Admin cannot be removed from group",
          400
        )
      );
    }

    // Check if user exists in group
    const isMember = chat.participants.some(
      (participant) =>
        participant.toString() ===
        userId.toString()
    );

    if (!isMember) {
      return next(
        new ErrorHandler(
          "User is not in this group",
          400
        )
      );
    }

    // Remove user
    chat.participants = chat.participants.filter(
      (participant) =>
        participant.toString() !==
        userId.toString()
    );

    await chat.save();

    // Get updated group data
    const updatedChat = await Chat.findById(chatId)
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");

    // Socket notification
    const io = req.app.get("io");

    io.to(userId.toString()).emit(
      "removedFromGroup",
      updatedChat
    );

    return res.status(200).json({
      success: true,
      chat: updatedChat,
    });
  }
);


export const getGroupDetails = catchAsyncError(
  async (req, res, next) => {
    const { chatId } = req.params;

    if (!chatId) {
      return next(
        new ErrorHandler(
          "ChatId is required",
          400
        )
      );
    }

    const chat = await Chat.findById(chatId)
      .populate(
        "participants",
        "name email avatar"
      )
      .populate(
        "groupAdmin",
        "name email avatar"
      );

    if (!chat) {
      return next(
        new ErrorHandler(
          "Group not found",
          404
        )
      );
    }

    // Ensure it is a group
    if (!chat.isGroupChat) {
      return next(
        new ErrorHandler(
          "Invalid group chat",
          400
        )
      );
    }

    // Check membership
    const isMember = chat.participants.some(
      (participant) =>
        participant._id.toString() ===
        req.user._id.toString()
    );

    if (!isMember) {
      return next(
        new ErrorHandler(
          "You are not a member of this group",
          403
        )
      );
    }

    return res.status(200).json({
      success: true,
      group: chat,
      totalMembers:
        chat.participants.length,
      createdAt: chat.createdAt,
    });
  }
);                                                   


export const messageSeen = catchAsyncError(
  async (req, res, next) => {
    const { messageId } = req.body;

    if (!messageId) {
      return next(
        new ErrorHandler(
          "MessageId is required",
          400
        )
      );
    }

    const message = await Message.findById(
      messageId
    );

    if (!message) {
      return next(
        new ErrorHandler(
          "Message not found",
          404
        )
      );
    }

    const chat = await Chat.findById(
      message.chatId
    );

    if (!chat) {
      return next(
        new ErrorHandler(
          "Chat not found",
          404
        )
      );
    }

    // Group chat only
    if (!chat.isGroupChat) {
      return next(
        new ErrorHandler(
          "This endpoint is only for group chats",
          400
        )
      );
    }

    const isMember =
      chat.participants.some(
        (participant) =>
          participant.toString() ===
          req.user._id.toString()
      );

    if (!isMember) {
      return next(
        new ErrorHandler(
          "You are not a member of this group",
          403
        )
      );
    }

    if(String(message.senderId) ===
      String(req.user._id)
   ) {
    return next(new ErrorHandler("Sender cannot mark own message as seen", 400));
   }
  
    const alreadySeen =
      message.seenBy.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (!alreadySeen) {
      message.seenBy.push(
        req.user._id
      );

      await message.save();
    }

    const io = req.app.get("io");

    io.to(chat._id.toString()).emit("messageSeen", {
    messageId,
    userId: req.user._id
});

    return res.status(200).json({
      success: true,
      message: "Message marked as seen",
      seenBy: message.seenBy,
    });
  }
);


export const updateGroupImage = catchAsyncError(
  async (req, res, next) => {
    const { chatId } = req.body;
    const groupImage = req.files?.groupImage

    if (!chatId || !groupImage) {
      return next(
        new ErrorHandler(
          "ChatId and groupImage are required",
          400
        )
      );
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(
        new ErrorHandler(
          "Group not found",
          404
        )
      );
    }

    if (!chat.isGroupChat) {
      return next(
        new ErrorHandler(
          "Invalid group chat",
          400
        )
      );
    }

    if (
      String(chat.groupAdmin) !==
      String(req.user._id)
    ) {
      return next(
        new ErrorHandler(
          "Only group admin can update group image",
          403
        )
      );
    }

    if(chat.groupImage) {
       const publicId = chat.groupImage.split("/").pop().split(".")[0];

       await cloudinary.uploader.destroy(
          `group_images/${publicId}`
       );
    }

    const uploadedImage = await cloudinary.uploader.upload(
    groupImage.tempFilePath,
    {
        folder: "group_images",
    }
  );

    // Save Cloudinary URL
    chat.groupImage =   
      uploadedImage.secure_url;

    await chat.save();

    const updatedChat =
      await Chat.findById(chatId)
        .populate("participants", "-password")
        .populate("groupAdmin", "-password");

    const io = req.app.get("io");

    updatedChat.participants.forEach(
      (participant) => {
        io.to(
          participant._id.toString()
        ).emit(
          "groupImageUpdated",
          updatedChat
        );
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Group image updated successfully",
      chat: updatedChat,
    });
  }
);               


export const renameGroup = catchAsyncError(async (req, res, next) => {
  const { chatId, name } = req.body;

  if (!chatId || !name) {
    return next(
      new ErrorHandler(
        "ChatId & name required",
        400
      )
    );
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(
      new ErrorHandler(
        "Chat not found",
        404
      )
    );
  }

  if (
    String(chat.groupAdmin) !==
    String(req.user._id)
  ) {
    return next(
      new ErrorHandler(
        "Only admin can rename group",
        403
      )
    );
  }

  const updatedChat =
    await Chat.findByIdAndUpdate(
      chatId,
      { chatName: name },
      { new: true }
    )
      .populate("participants", "-password")
      .populate("groupAdmin", "-password");

  // SOCKET UPDATE
  const io = req.app.get("io");

  updatedChat.participants.forEach(
    (p) => {
      io.to(p._id.toString()).emit(
        "chatUpdated",
        updatedChat
      );
    }
  );

  return res.status(200).json({
    success: true,
    chat: updatedChat,
  });
});
