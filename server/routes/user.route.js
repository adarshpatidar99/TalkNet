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
  phoneLogin,
  phoneRegister,
} from "../controllers/user.controller.js";

import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Email authentication
router.post("/register", register);
router.post("/login", login);

// Google authentication
router.post("/google/register", googleRegister);
router.post("/google/login", googleLogin);

// Phone OTP authentication
router.post("/phone/register", phoneRegister);
router.post("/phone/login", phoneLogin);

// Protected routes
router.get("/me", isAuth, getCurrentUser);
router.post("/logout", isAuth, logout);
router.patch("/updateprofile", isAuth, updateProfile);
router.delete("/remove-avatar", isAuth, removeAvatar);

router.get("/", isAuth, getAllUsers);
router.get("/profile/:id", isAuth, getUserProfile);

export default router;
