import express from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
  logout,
  generateTokens,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";
import asyncHandler from "../utils/AsyncHandler.js";
import validate from "../middleware/validateMiddleware.js";
import userValidation from "../validations/userValidation.js";
import upload from "../middleware/multer.js";
import loginSchema from "../validations/loginSchema.js";
import forgotPasswordSchema from "../validations/forgotPasswordSchema.js";
import resetPasswordSchema from "../validations/resetPasswordSchema.js";
import verifyToken from "../middleware/VerifyUser.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate(userValidation),
  asyncHandler(register),
);

userRouter.post("/login", validate(loginSchema), asyncHandler(login));
userRouter.get("/me", asyncHandler(verifyToken), asyncHandler(getMe));
// Fix: logout should be POST not GET, and token refresh should be POST
userRouter.post("/logout", asyncHandler(verifyToken), asyncHandler(logout));
userRouter.post("/refresh-token", asyncHandler(generateTokens));
userRouter.get("/verify-email/:token", asyncHandler(verifyEmail));
userRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);
userRouter.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  asyncHandler(resetPassword),
);

export default userRouter;
