import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import sendMail from "../utils/sendMail.js";
import generateAccessAndRefreshToken from "../utils/generateToken.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      throw new ApiError(400, "User Already Exists");
    }

    if (!req.files?.profile?.[0]) {
      throw new ApiError(400, "Profile image is required");
    }
    if (!req.files?.coverImage?.[0]) {
      throw new ApiError(400, "Cover image is required");
    }

    const uploadedProfile = await uploadOnCloudinary(req.files.profile[0].path, false);
    const uploadedCoverImage = await uploadOnCloudinary(req.files.coverImage[0].path, false);

    if (!uploadedProfile) throw new ApiError(500, "Failed to upload profile image");
    if (!uploadedCoverImage) throw new ApiError(500, "Failed to upload cover image");

    const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    let userInfo = new User({
      ...req.validatedData,
      profile: uploadedProfile,
      coverImage: uploadedCoverImage,
      emailVerifiedToken: token,
    });
    
    userInfo = await userInfo.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verifyEmail/${token}`;
    const html = `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `;

    // Send to the registering user's email (was hardcoded before — fixed)
    await sendMail(email, "Verify your Yaksera account", html);

    res.status(201).json(
      new ApiResponse(201, "Registration successful. Please check your email to verify your account."),
    );
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ emailVerifiedToken: req.params.token });
    if (!user) {
      throw new ApiError(400, "Invalid or expired verification token.");
    }

    user.emailVerifiedToken = null;
    user.emailVerified = true;
    await user.save();

    res.status(200).json(new ApiResponse(200, "Email verified successfully.", { id: user._id }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid credentials.");
    }

    // Fix: block login until email is verified
    if (!user.emailVerified) {
      throw new ApiError(403, "Please verify your email before logging in.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(200, "User logged in successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }),
      );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken -emailVerifiedToken",
    );
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    res.status(200).json(new ApiResponse(200, "User found", user));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    user.refreshToken = undefined;
    await user.save();

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(new ApiResponse(200, "Logged out successfully."));
  } catch (error) {
    next(error);
  }
};

export const generateTokens = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
      return next(new ApiError(401, "Refresh token not found"));
    }

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    if (user.refreshToken !== incomingRefreshToken) {
      return next(new ApiError(401, "Refresh token mismatch"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(new ApiResponse(200, "Access token refreshed successfully"));
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired refresh token"));
  }
};
