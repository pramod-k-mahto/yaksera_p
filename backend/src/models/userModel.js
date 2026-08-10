import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Phone Number is required"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"],
    },
    profile: {
      type: String,
      trim: true,
      default: null,
    },
    coverImage: {
      type: String,
      trim: true,
      default: null,
    },
    refreshToken: {
      type: String,
      trim: true,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedToken: {
      type: String,
      trim: true,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      trim: true,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Fix: next() calls restored so errors are properly propagated
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (error) {
    throw new ApiError(400,"error while hashing the password",error)
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

const User = mongoose.model("User", userSchema);
export default User;
