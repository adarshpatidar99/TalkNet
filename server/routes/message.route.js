import express from "express";

import {
  getGroupMessage,
  getMessage,
  imageUpload,
  messageSave,
  sendMessage,
  videoUpload,
  getVideoUploadSignature,
  voiceUpload,
  deleteMessageForMe,
  clearOneToOneChat,
  clearGroupChatForMe,
  deleteMessageForEveryone,
} from "../controllers/message.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", isAuth, sendMessage);
router.get("/private/:senderId/:receiverId", isAuth, getMessage);
router.get("/group/:chatId", isAuth, getGroupMessage);
router.delete("/:messageId/for-me", isAuth, deleteMessageForMe);
router.delete("/private/:receiverId/clear", isAuth, clearOneToOneChat); 

// Media upload APIs         
router.post("/upload/image", isAuth, imageUpload);
router.post("/upload/video", isAuth, videoUpload);
router.post("/upload/voice", isAuth, voiceUpload);

router.delete("/group/:chatId/clear", isAuth, clearGroupChatForMe);

router.get(
  "/upload/video/signature",
  isAuth,                                                                      
  getVideoUploadSignature
);

router.delete(
  "/:messageId/for-everyone",
  isAuth,
  deleteMessageForEveryone
);

router.post("/save", isAuth, messageSave);

export default router;
