import Chat from "../models/chat.model.js";
import ErrorHandler from '../middlewares/error.middleware.js';
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js'

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

// Fetch all chats for logged user
export const fetchChats = catchAsyncError(async (req, res, next) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate("participants", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  return res.status(200).json({ success: true, chats });
});

// Create group chat
export const createGroupChat = catchAsyncError(async (req, res, next) => {
  const { name, userIds } = req.body;

  if (!name || !userIds || userIds.length < 2)
    return next(
      new ErrorHandler("Group name & at least 2 users required", 400)
    );

  const groupChat = await Chat.create({
    chatName: name,
    isGroupChat: true,
    participants: [...userIds, req.user._id],
    groupAdmin: req.user._id,
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");

  const io = req.app.get("io");
  userIds.forEach((uid) =>
    io.to(uid.toString()).emit("newGroupChat", fullGroupChat)
  );

  return res
    .status(201)
    .json({ success: true, groupChat: fullGroupChat });
});

// Rename group
export const renameGroup = catchAsyncError(async (req, res, next) => {
  const { chatId, name } = req.body;

  if (!chatId || !name)
    return next(new ErrorHandler("ChatId & name required", 400));

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: name },
    { new: true }
  )
    .populate("participants", "-password")
    .populate("groupAdmin", "-password");

  const io = req.app.get("io");
  updatedChat.participants.forEach((p) =>
    io.to(p._id.toString()).emit("chatUpdated", updatedChat)
  );

  return res.status(200).json({ success: true, chat: updatedChat });
});

// Add user to group
export const addToGroup = catchAsyncError(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat)
    return next(new ErrorHandler("Chat not found", 404));

  chat.participants.push(userId);
  await chat.save();

  const updatedChat = await Chat.findById(chatId).populate(
    "participants",
    "-password"
  );

  const io = req.app.get("io");
  io.to(userId).emit("addedToGroup", updatedChat);

  return res.status(200).json({ success: true, chat: updatedChat });
});

// Remove user from group
export const removeFromGroup = catchAsyncError(
  async (req, res, next) => {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat)
      return next(new ErrorHandler("Chat not found", 404));

    chat.participants = chat.participants.filter(
      (p) => p.toString() !== userId
    );
    await chat.save();

    const updatedChat = await Chat.findById(chatId).populate(
      "participants",
      "-password"
    );

    const io = req.app.get("io");
    io.to(userId).emit("removedFromGroup", updatedChat);

    return res
      .status(200)
      .json({ success: true, chat: updatedChat });
  }
);
                