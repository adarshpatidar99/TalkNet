import User from '../models/user.model.js'
import sendToken from "../utils/sendToken.js";
import bcrypt from "bcrypt";
import ErrorHandler from '../middlewares/error.middleware.js'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js'
import cloudinary from "../config/cloudinary.js";


// REGISTER USER
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password)
    return next(new ErrorHandler("All fields are required", 400));

  // IMAGE CHECK
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Image is required, please provide image", 400));
  }

  const avatar = req.files.avatar;

  // CORRECT MIME TYPES
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];

  if (!allowedMimeTypes.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler("Please provide avatar in valid format: png, jpeg, webp, jpg", 400)
    );
  }

  // UPLOAD TO CLOUDINARY
  const cloudinaryResponse = await cloudinary.uploader.upload(
  avatar.tempFilePath,
  { folder: "Realtime-Chat-App" }
);


  if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
    return next(new ErrorHandler("Failed to upload image on Cloudinary...", 500));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(new ErrorHandler("User already exists with this email", 400));


  const user = await User.create({
    name,
    email,
    username,
    password,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  sendToken(user, 200, res, "User registered successfully");
});


// LOGIN USER
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Email and password are required", 400));
  const user = await User.findOne({ email }).select("+password"); 

  if (!user)
    return next(new ErrorHandler("User not registered", 404));
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Incorrect password", 400));
    sendToken(user, 200, res, "Login successful");
});


// LOGOUT USER
export const logout = catchAsyncError(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


// GET ALL USERS
export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});


// GOOGLE LOGIN
export const googleLogin = catchAsyncError(async (req, res, next) => {
const { name, email, avatar } = req.body;

if (!name || !email) {
return next(new ErrorHandler("Name and email are required", 400));
}

let user = await User.findOne({ email });

if (user) {
// User exists → login
return sendToken(user, 200, res, "User login with Google successfully!");
}

// User doesn’t exist → create new account
user = await User.create({
name,
email,
avatar: {
      public_id: null, 
      url: avatar },
username: email.split("@")[0],
isGoogleAccount: true,
});

sendToken(user, 201, res, "User registered with Google successfully!");
});


// GOOGLE REGISTER
export const googleRegister = catchAsyncError(async (req, res, next) => {
const { name, email, username, avatar } = req.body;

if (!name || !email) {
return next(new ErrorHandler("Name, email, and role are required", 400));
}

const existingUser = await User.findOne({ email });

if (existingUser) {
// Instead of error, you might want to log them in
sendToken(existingUser, 200, res, "User register with Google!");
return;
}

const user = await User.create({
name,
email,
username,
avatar: {
      public_id: null, 
      url: avatar },
isGoogleAccount: true, // mark it so password isn't required
});

sendToken(user, 201, res, "User Registered with Google!");
});



// GET CURRENT LOGGED IN USER
export const getCurrectUser = catchAsyncError(async (req, res, next) => {
  if (!req.user)
    return next(new ErrorHandler("User not logged in", 401));

  const user = await User.findById(req.user.id).select("-password");

  if (!user)
    return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});



export const updateProfile = catchAsyncError(
  async (req, res, next) => {

    if (!req.user) {
      return next(
        new ErrorHandler("User not loggedIn...", 401)
      );
    }

    const { name, about, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(
        new ErrorHandler("User not found", 404)
      );
    }

    // =========================
    // Update Fields
    // =========================
    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {

      if (!/^\d{10}$/.test(phone)) {
       return next(
       new ErrorHandler(
        "Phone number must be exactly 10 digits",
        400
      )
    );
       }
      user.phone = phone;
    }

    if (about !== undefined) {
      user.about = about;
    }

    // =========================
    // Avatar Upload
    // =========================
    const avatar = req.files?.avatar;

    if (avatar) {

      const allowedMimeType = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/jpg",
      ];

      if (
        !allowedMimeType.includes(avatar.mimetype)
      ) {
        return next(
          new ErrorHandler(
            "Please provide image in valid format...",
            400
          )
        );
      }

      const cloudinaryResponse =
        await cloudinary.uploader.upload(
          avatar.tempFilePath,
          {
            folder: "Realtime-Chat-App",
          }
        );

      if (
        !cloudinaryResponse ||
        !cloudinaryResponse.secure_url
      ) {
        return next(
          new ErrorHandler(
            "Failed to upload image on cloudinary",
            400
          )
        );
      }

      user.avatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully...",
      user,
    });
  }
);

