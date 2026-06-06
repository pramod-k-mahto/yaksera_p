import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import upload from "../middleware/multer.js";
import caseStudyValidationSchema from "../validations/caseStudyValidationSchema.js";
import {
  createCaseStudy,
  getAllCaseStudies,
  getSingleCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "../controller/caseStudyController.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();
const caseStudyUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "screenshots", maxCount: 10 },
]);

// Public
router.get("/", asyncHandler(getAllCaseStudies));
router.get("/:id", asyncHandler(getSingleCaseStudy));

// Protected
router.post("/", asyncHandler(verifyToken), caseStudyUpload, validate(caseStudyValidationSchema), asyncHandler(createCaseStudy));
router.patch("/:slug", asyncHandler(verifyToken), caseStudyUpload, validate(caseStudyValidationSchema.partial()), asyncHandler(updateCaseStudy));
router.delete("/:slug", asyncHandler(verifyToken), asyncHandler(deleteCaseStudy));

export default router;
