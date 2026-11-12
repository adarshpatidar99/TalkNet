import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    about: {
      type: String,
      default: "Hey there! I am using TalkNet",
      maxlength: 150,
    },

    password: {
      type: String,
      default: null,
      select: false,
      required: function () {
        return !this.isGoogleAccount && !this.phoneVerified;
      },
    },

    phoneNumber: {
      type: String,
      default: undefined,
      trim: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },

    isGoogleAccount: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;

  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Unique phone number only when phoneNumber is a string
userSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $type: "string" },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
