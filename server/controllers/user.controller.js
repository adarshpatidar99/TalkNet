import User from '../models/user.model.js'
import sendToken from "../utils/sendToken.js";
import bcrypt from "bcrypt";
import ErrorHandler from '../middlewares/error.middleware.js'
import catchAsyncError from '../middlewares/catchAsyncError.middleware.js'
import cloudinary from "../config/cloudinary.js";
import { firebaseAdminAuth } from '../config/firebaseAdmin.js';


const normalizeRegistrationData = (name, email, username) => {
  return {
    name: name?.trim(),
    email: email?.trim().toLowerCase(),
    username: username?.trim().toLowerCase(),
  };
};


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


const verifyGoogleToken = async (idToken) => {
  if (!idToken) {
    throw new ErrorHandler("Firebase ID token is required", 400);
  }

  let decodedToken;

  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    throw new ErrorHandler("Invalid or expired Google token", 401);
  }

  if (
    decodedToken.firebase?.sign_in_provider !== "google.com" ||
    !decodedToken.email ||
    decodedToken.email_verified !== true
  ) {
    throw new ErrorHandler("Valid Google authentication required", 401);
  }

  return decodedToken;
};

// GOOGLE REGISTER
export const googleRegister = catchAsyncError(
  async (req, res, next) => {
    const { idToken, username } = req.body;

    const decodedToken = await verifyGoogleToken(idToken);

    const email = decodedToken.email.trim().toLowerCase();

    // Check whether this email already exists.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isGoogleAccount) {
        return next(
          new ErrorHandler(
            "This email is already registered using another login method.",
            409
          )
        );
      }

      return sendToken(
        existingUser,
        200,
        res,
        "Google login successful!"
      );
    }

    const normalizedUsername = username?.trim().toLowerCase();

    if (
      !normalizedUsername ||
      !/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)
    ) {
      return next(
        new ErrorHandler("Invalid username. Please enter a valid username.", 400)
      );
    }

    const existingUsername = await User.findOne({
      username: normalizedUsername,
    });

    if (existingUsername) {
      return next(
        new ErrorHandler("Username already taken", 409)
      );
    }

    const user = await User.create({
      name: decodedToken.name || "TalkNet User",
      email,
      username: normalizedUsername,
      password: null,
      isGoogleAccount: true,
      avatar: {
        public_id: null,
        url: decodedToken.picture || null,
      },
    });

    return sendToken(
      user,
      201,
      res,
      "Google registration successful!"
    );
  }
);

// GOOGLE LOGIN
export const googleLogin = catchAsyncError(
  async (req, res, next) => {
    const { idToken } = req.body;

    const decodedToken = await verifyGoogleToken(idToken);

    const email = decodedToken.email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorHandler(
          "Account not found. Please register first.",
          404
        )
      );
    }

    if (!user.isGoogleAccount) {
      return next(
        new ErrorHandler(
          "This email is registered using another login method.",
          409
        )
      );
    }

    return sendToken(
      user,
      200,
      res,
      "Google login successful!"
    );
  }
);


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


export const phoneLogin = catchAsyncError(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ErrorHandler("Firebase ID token is required", 400));
  }

  let decodedToken;

  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return next(new ErrorHandler("Invalid or expired phone authentication token", 401));
  }

  // Accept only tokens authenticated through Firebase Phone Authentication.
  if (decodedToken.firebase?.sign_in_provider !== "phone") {
    return next(new ErrorHandler("Please authenticate using your phone number", 401));
  }

  const phoneNumber = decodedToken.phone_number;

  if (!phoneNumber) {
    return next(new ErrorHandler("Verified phone number not found", 400));
  }

  // Existing TalkNet account: log in without creating a duplicate.
  let user = await User.findOne({ phoneNumber });

  if (user) {
    if (!user.phoneVerified) {
      return next(new ErrorHandler("Phone number is not verified on this account", 403));
    }

    return sendToken(user, 200, res, "Phone login successful");
  }

  // Existing schema requires both email and username.
  // These placeholders let phone-only accounts use the existing schema.
  const digits = phoneNumber.replace(/\D/g, "");
  const email = `phone-${digits}@phone.talknet.invalid`;

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return next(
      new ErrorHandler(
        "An account already uses this phone-login identifier. Please contact support.",
        409
      )
    );
  }

  // Generate an available username for the new phone-only account.
  let username;
  let usernameExists = true;

  while (usernameExists) {
    const suffix = Math.random().toString(36).slice(2, 10);
    username = `phone_${digits.slice(-8)}_${suffix}`;
    usernameExists = Boolean(await User.findOne({ username }));
  }

  user = await User.create({
    name: "TalkNet User",
    username,
    email,
    phoneNumber,
    phoneVerified: true,
    password: null,
    isGoogleAccount: false,
  });

  return sendToken(user, 201, res, "Phone account created successfully");
});


export const phoneRegister = catchAsyncError(async (req, res, next) => {
  const { idToken, name, email, username } = req.body;

  if (!idToken || !name?.trim() || !email?.trim() || !username?.trim()) {
    return next(
      new ErrorHandler(
        "Verified phone, name, email, and username are required",
        400
      )
    );
  }

  let decodedToken;

  try {
    decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  } catch {
    return next(
      new ErrorHandler("Invalid or expired Firebase token", 401)
    );
  }

  if (decodedToken.firebase?.sign_in_provider !== "phone") {
    return next(
      new ErrorHandler("Please verify your phone number using OTP", 401)
    );
  }

  const phoneNumber = decodedToken.phone_number;

  if (!phoneNumber) {
    return next(
      new ErrorHandler("Verified phone number not found", 400)
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const existingPhone = await User.findOne({ phoneNumber });

  if (existingPhone) {
    return next(
      new ErrorHandler(
        "An account with this phone number already exists. Please log in.",
        409
      )
    );
  }

  const existingEmail = await User.findOne({
    email: normalizedEmail,
  });

  if (existingEmail) {
    return next(
      new ErrorHandler("Email is already registered", 409)
    );
  }

  const existingUsername = await User.findOne({
    username: normalizedUsername,
  });

  if (existingUsername) {
    return next(
      new ErrorHandler("Username is already taken", 409)
    );
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    username: normalizedUsername,
    phoneNumber,
    phoneVerified: true,
    password: null,
    isGoogleAccount: false,
  });

  return sendToken(
    user,
    201,
    res,
    "Account registered successfully with phone"
  );
});
