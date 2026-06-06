import express from "express";
import asyncHandler from "../utils/AsyncHandler.js";
import upload from "../middleware/multer.js";
import {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
} from "../controller/servicesController.js";
import verifyToken from "../middleware/VerifyUser.js";

const serviceUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "heroImage", maxCount: 1 },
  { name: "mockupImage", maxCount: 1 },
]);

const router = express.Router();

// Public
router.get("/", asyncHandler(getAllServices));
router.get("/:slug", asyncHandler(getSingleService));

// Protected
router.post("/create", asyncHandler(verifyToken), serviceUpload, asyncHandler(createService));
router.patch("/:slug", asyncHandler(verifyToken), serviceUpload, asyncHandler(updateService));
router.delete("/:slug", asyncHandler(verifyToken), asyncHandler(deleteService));

export default router;
