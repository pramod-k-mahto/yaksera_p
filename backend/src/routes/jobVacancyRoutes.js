import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jobVacancyValidationSchema from "../validations/jobVacancyValidationSchema.js";
import {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} from "../controller/jobVacancyController.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();

// Public
router.get("/", asyncHandler(getAllJobs));
router.get("/:id", asyncHandler(getSingleJob));

// Protected
router.post("/create", asyncHandler(verifyToken), validate(jobVacancyValidationSchema), asyncHandler(createJob));
router.patch("/:id", asyncHandler(verifyToken), validate(jobVacancyValidationSchema.partial?.() ?? jobVacancyValidationSchema), asyncHandler(updateJob));
router.delete("/:id", asyncHandler(verifyToken), asyncHandler(deleteJob));

export default router;
