import express from "express";
import validate from "../middleware/validateMiddleware.js";
import asyncHandler from "../utils/AsyncHandler.js";
import portfolioValidationSchema from "../validations/portfolioValidationSchema.js";
import {
  createPortfolio,
  getAllPortfolios,
  getSinglePortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controller/portfolioController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/VerifyUser.js";

const router = express.Router();
const portfolioUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);

// Public
router.get("/", asyncHandler(getAllPortfolios));
router.get("/:slug", asyncHandler(getSinglePortfolio));

// Protected
router.post("/create", asyncHandler(verifyToken), portfolioUpload, validate(portfolioValidationSchema), asyncHandler(createPortfolio));
router.patch("/:id", asyncHandler(verifyToken), portfolioUpload, validate(portfolioValidationSchema.partial?.() ?? portfolioValidationSchema), asyncHandler(updatePortfolio));
router.delete("/:id", asyncHandler(verifyToken), asyncHandler(deletePortfolio));

export default router;
