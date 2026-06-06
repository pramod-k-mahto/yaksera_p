// routes/contactRoutes.js
import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import projectInquiryValidationSchema from "../validations/projectInquiryValidation.js";

import {
  createProjectInquiry,
  getAllProjectInquiries,
  getSingleProjectInquiry,
} from "../controller/contactController.js";

const router = express.Router();

// CREATE PROJECT INQUIRY
router.post(
  "/create",
  validate(projectInquiryValidationSchema),
  asyncHandler(createProjectInquiry),
);

// GET ALL PROJECT INQUIRIES
router.get("/", asyncHandler(getAllProjectInquiries));

// GET SINGLE PROJECT INQUIRY
router.get("/:id", asyncHandler(getSingleProjectInquiry));

export default router;
