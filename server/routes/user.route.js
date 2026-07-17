import express from "express";

import {
  getAllUsers,
  getCurrentUser,
  login,
  logout,
  register,
  googleLogin,
  googleRegister,
  updateProfile,
  removeAvatar,
  getUserProfile,
} from "../controllers/user.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google/register", googleRegister);
router.post("/google/login", googleLogin);

// Protected routes (require authentication)
router.get("/me", isAuth, getCurrentUser);
router.post("/logout", isAuth, logout);
router.patch("/updateprofile", isAuth, updateProfile);

// Get all users (admin/debug use case)       
router.get("/", isAuth ,getAllUsers);
router.get('/profile/:id', isAuth, getUserProfile);

router.delete('/remove-avatar', isAuth, removeAvatar);

export default router;
