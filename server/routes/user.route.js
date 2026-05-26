import express from 'express';
import { getAllUsers, getCurrectUser, login, logout, register, googleLogin, googleRegister, updateProfile } from '../controllers/user.controller.js'
import { isAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/', getAllUsers);
router.get('/me', isAuth , getCurrectUser);
router.post('/google/register', googleRegister);
router.post('/google/login', googleLogin )
router.put('/updateprofile', isAuth, updateProfile);                                             

export default router