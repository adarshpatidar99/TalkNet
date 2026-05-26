import express from 'express';
import {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} from '../controllers/chat.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/access', isAuth ,accessChat);
router.get('/', fetchChats);
router.post('/group', isAuth , createGroupChat);
router.put('/group/rename', isAuth, renameGroup);
router.put('/group/add', addToGroup);
router.put('/group/remove', removeFromGroup);

export default router;
