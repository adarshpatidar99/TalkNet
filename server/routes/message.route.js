import express from 'express';
import { deleteMessage, getGroupMessage, getMessage, imageUpload, messageSave, sendMessage, updatedMessageStatus, updateMessage, videoMessageSave, videoUpload, voiceUpload } from '../controllers/message.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';
                                                              
const router = express.Router();

router.post('/send', sendMessage);
router.get('/getall/:senderId/:receiverId', isAuth, getMessage);

router.get('/group/getall/:chatId', isAuth, getGroupMessage);            

router.put('/updatestatus/:messageId', updatedMessageStatus);
router.get('/delete/:messageId', deleteMessage);
router.put('/update/:messageId', updateMessage);
router.post('/voice', voiceUpload);                            
router.post('/save', messageSave);                              
router.post('/video', videoUpload );
router.post('/savevideo', videoMessageSave);
router.post('/image', imageUpload);
                                                               
export default router;               