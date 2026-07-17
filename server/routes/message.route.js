import express from "express";
import {
  getGroupMessage,
  getMessage,
  imageUpload,
  messageSave,
  sendMessage,
  videoUpload,
  voiceUpload,
} from "../controllers/message.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();  

router.post("/send", isAuth, sendMessage);
router.get("/private/:senderId/:receiverId", isAuth, getMessage);
router.get("/group/:chatId", isAuth, getGroupMessage);

// Media Upload APIs
router.post("/upload/image", isAuth, imageUpload);
router.post("/upload/video", isAuth, videoUpload);
router.post("/upload/voice", isAuth, voiceUpload);

router.post("/save", isAuth, messageSave);

export default router;