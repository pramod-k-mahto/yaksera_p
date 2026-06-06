import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import blogPostValidationSchema from "../validations/blogPostValidationSchema.js";
import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  updateBlogViews,
} from "../controller/blogController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();
const coverUpload = upload.fields([{ name: "coverImage", maxCount: 1 }]);

// Public
router.get("/", asyncHandler(getAllBlogs));
router.patch("/view/:id", asyncHandler(updateBlogViews));
router.get("/:slug", asyncHandler(getSingleBlog));

// Protected (admin only)
router.post("/create", asyncHandler(verifyToken), coverUpload, validate(blogPostValidationSchema), asyncHandler(createBlog));
router.patch("/:id", asyncHandler(verifyToken), coverUpload, validate(blogPostValidationSchema.partial?.() ?? blogPostValidationSchema), asyncHandler(updateBlog));
router.delete("/:id", asyncHandler(verifyToken), asyncHandler(deleteBlog));

export default router;
