// import express from 'express';
// import {
//   accessChat,
//   fetchChats,
//   createGroupChat,
//   renameGroup,
//   addToGroup,
//   removeFromGroup,
//   sendGroupMessage,
//   getGroupMessage,
//   deleteGroupMessage,
//   leaveGroup
// } from '../controllers/chat.controller.js';
// import { isAuth } from '../middlewares/auth.middleware.js';

// const router = express.Router();

// router.post('/access', isAuth ,accessChat);
// router.get('/', fetchChats);
// router.post('/group', isAuth , createGroupChat);
// router.put('/group/rename', isAuth, renameGroup);
// router.put('/group/add', isAuth , addToGroup);
// router.put('/group/remove', isAuth , removeFromGroup);
// router.post('/group/send', isAuth , sendGroupMessage);
// router.get('/group/message', isAuth ,getGroupMessage);
// router.delete('/group/message/delete', isAuth, deleteGroupMessage);
// router.delete('/group/leave', isAuth, leaveGroup);

// export default router;






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
  deleteGroupMessage,
  getGroupDetails,
  leaveGroup,
  transferGroupAdmin,
  messageSeen,
  updateGroupImage,
  updateGroupDescription,
  deleteGroup,
} from "../controllers/chat.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1-to-1 chat
router.post("/access", isAuth, accessChat);
router.get("/", isAuth, fetchChats);
                                                 
// Group management
router.post("/group", isAuth, createGroupChat);
router.put("/group/rename", isAuth, renameGroup);
router.put("/group/add", isAuth, addToGroup);
router.put("/group/remove", isAuth, removeFromGroup);
router.delete("/group/leave", isAuth, leaveGroup);
router.delete("/group/delete", isAuth, deleteGroup)
                                     
// Group messages
router.post("/group/send", isAuth, sendGroupMessage);

router.get(
  "/group/message/:chatId",
  isAuth,
  getGroupMessage
);

router.delete(
  "/group/message/:messageId",
  isAuth,
  deleteGroupMessage
);

router.put('/group/transferadmin', isAuth, transferGroupAdmin)

router.get('/group/details/:chatId', isAuth, getGroupDetails);      

router.put('/group/image', isAuth, updateGroupImage);
router.put('/group/description', isAuth, updateGroupDescription);

export default router;