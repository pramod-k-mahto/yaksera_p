import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import upload from "../middleware/multer.js";
import jobApplicationValidationSchema from "../validations/jobApplicationValidationSchema.js";
import {
  applyJob,
  getAllApplications,
  getSingleApplication,
  updateApplicationStatus,
} from "../controller/JobApplicationController.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();

// Public — anyone can apply for a job
router.post(
  "/apply",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  validate(jobApplicationValidationSchema),
  asyncHandler(applyJob),
);

// Protected — admin only
router.get("/", asyncHandler(verifyToken), asyncHandler(getAllApplications));
router.get("/:id", asyncHandler(verifyToken), asyncHandler(getSingleApplication));
router.patch("/:id/status", asyncHandler(verifyToken), asyncHandler(updateApplicationStatus));

export default router;
