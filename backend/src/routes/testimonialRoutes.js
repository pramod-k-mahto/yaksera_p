import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import testimonialValidationSchema from "../validations/testimonialValidationSchema.js";
import {
  createTestimonial,
  getAllTestimonials,
  getSingleTestimonial,
} from "../controller/testimonialController.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();

// Public
router.get("/", asyncHandler(getAllTestimonials));
router.get("/:id", asyncHandler(getSingleTestimonial));

// Protected
router.post("/create", asyncHandler(verifyToken), validate(testimonialValidationSchema), asyncHandler(createTestimonial));

export default router;
