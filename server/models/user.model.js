import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    about: {
      type: String,
      default: "Hey there! i am using TalkNet",
      maxLength: 150
    },

    password: {
  type: String,
   default: null ,
  select: false,
},

  phone: {
     type: String,
     default: ""
  },

  avatar: {
  public_id: { type: String },
  url: { type: String, required: false }, // required only for uploaded images
},

  isGoogleAccount: {
    type: Boolean,
    default: false
  },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    }

  },
  { timestamps: true }
);

// 🔐 Hash password before save (fixed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🎫 Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", userSchema);
export default User;
