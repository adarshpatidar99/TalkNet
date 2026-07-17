import User from '../models/user.model.js'
import sendToken from "../utils/sendToken.js";
import bcrypt from "bcrypt";
import ErrorHandler from '../middlewares/error.middleware.js'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js'
import cloudinary from "../config/cloudinary.js";


export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return next(
      new ErrorHandler("All fields are required", 400)
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new ErrorHandler(
        "User already exists with this email",
        400
      )
    );
  }

   const existingUsername = await User.findOne({
    username: username.toLowerCase(),
   });

    if(existingUsername){
        return next(
         new ErrorHandler(
             "Username already exists",
             400
         )
      );
    }

  let avatarData = {
    public_id: "",
    url: "",
  };

  // Avatar is optional
  if (req.files?.avatar) {
    const avatar = req.files.avatar;

    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(avatar.mimetype)) {
      return next(
        new ErrorHandler(
          "Please provide avatar in png, jpg, jpeg or webp format",
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
          "Failed to upload image to Cloudinary",
          500
        )
      );
    }

    avatarData = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.create({
    name,
    email,
    username,
    password,
    avatar: avatarData,
  });

  sendToken(
    user,
    200,
    res,
    "User registered successfully"
  );
});


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


export const logout = catchAsyncError(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});


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


export const googleRegister = catchAsyncError(async (req, res, next) => {
const { name, email, username, avatar } = req.body;

if (!name || !email) {
return next(new ErrorHandler("Name, email, and role are required", 400));
}

const existingUser = await User.findOne({ email });

if (existingUser) {
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
isGoogleAccount: true, 
});

sendToken(user, 201, res, "User Registered with Google!");
});


export const getCurrentUser = catchAsyncError(async (req, res, next) => {
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

    const { name, about } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(
        new ErrorHandler("User not found", 404)
      );
    }

    // Update Fields
    if (name !== undefined) {
      user.name = name;
    }

    if (about !== undefined) {
      user.about = about;
    }

    // Avatar Upload
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


export const removeAvatar = catchAsyncError(async (req, res, next) => {  

    if(!req.user) {
       return next (new ErrorHandler("User not loggedIn...", 401));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
    return next(new ErrorHandler("User not found", 404)
    )}; 

    if(user.avatar?.public_id) {
       await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = {
      public_id: "",
      url: "",
    }

    await user.save();

    res.status(200).json({
    success: true,
    message: "Profile picture removed successfully",
    user,
  });

})
 

export const getUserProfile = catchAsyncError (async (req, res, next) => {
   
    const {id} = req.params;     
    const user = await User.findById(id).select("-password");

    if(!user) {
       return next(new ErrorHandler("user not found...", 404))
    }                                            
     
    return res.status(200).json({
      success: true,                             
      user                                
    });                                          

})