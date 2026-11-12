import express from "express";
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  sendGroupMessage,
  getGroupMessage,
  getGroupDetails,
  leaveGroup,
  messageSeen,
  updateGroupImage,
  updateGroupDescription,
  deleteGroup,
  transferGroupAdmin,
} from "../controllers/chat.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// PRIVATE CHAT
router.post("/access", isAuth, accessChat);
router.get("/", isAuth, fetchChats);

// GROUP CHAT MANAGEMENT
router.post("/group", isAuth, createGroupChat);
router.delete("/group/delete", isAuth, deleteGroup);
router.delete("/group/leave", isAuth, leaveGroup);

// Group Members Management
router.put("/group/rename", isAuth, renameGroup);
router.put("/group/add", isAuth, addToGroup);
router.put("/group/remove", isAuth, removeFromGroup);

router.put("/group/image", isAuth, updateGroupImage);
router.put("/group/description", isAuth, updateGroupDescription);
router.post("/group/send", isAuth, sendGroupMessage);
router.get("/group/message/:chatId", isAuth, getGroupMessage);
router.get("/group/details/:chatId", isAuth, getGroupDetails);
router.put("/group/message/seen", isAuth, messageSeen);

router.put("/transfer-admin", isAuth, transferGroupAdmin);

export default router;