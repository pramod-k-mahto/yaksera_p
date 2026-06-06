import CaseStudy from "../models/studySchema.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
export const createCaseStudy = async (req, res) => {
  const exists = await CaseStudy.findOne({ slug: req.body.slug });
  if (exists) throw new ApiError(400, "Slug already exists");

  if (!req.files?.thumbnail?.[0]) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const thumbnailUrl = await uploadOnCloudinary(req.files.thumbnail[0].path, false);
  if (!thumbnailUrl) throw new ApiError(500, "Thumbnail upload failed");

  let screenshots = [];
  if (req.files?.screenshots?.length) {
    const uploaded = await Promise.all(
      req.files.screenshots.map((file) => uploadOnCloudinary(file.path, false))
    );
    screenshots = uploaded.filter(Boolean).map((url) => ({ url, caption: "" }));
  }

  const body = parseJsonFields(req.body);

  const data = await CaseStudy.create({
    ...body,
    thumbnail: thumbnailUrl,
    screenshots,
  });

  return res.status(201).json(new ApiResponse(201, "Case study created", data));
};

// ─────────────────────────────────────────────
// GET ALL
// Admin gets all (no status filter), public gets Published only
// Usage: /api/v1/case-studies?admin=true&category=Website&featured=true
// ─────────────────────────────────────────────
export const getAllCaseStudies = async (req, res) => {

  console.log(req.params)

  const data = await CaseStudy.find()
    .select("title slug category thumbnail shortDescription techStack featured order status industry createdAt")
    .sort({ order: 1, createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, "All case studies fetched", data));
};

// ─────────────────────────────────────────────
// GET SINGLE (by slug)
// Admin can view drafts, public cannot
// ─────────────────────────────────────────────
export const getSingleCaseStudy = async (req, res) => {

  // console.log(req.params)

  const filter = { _id: req.params.id };
  // console.log(filter)

  const data = await CaseStudy.findOne(filter);
  // console.log(data)
  if (!data) throw new ApiError(404, "Case study not found");

  return res.status(200).json(new ApiResponse(200, "Case study fetched", data));
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export const updateCaseStudy = async (req, res) => {
  const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
  if (!caseStudy) throw new ApiError(404, "Case study not found");

  const body = parseJsonFields(req.body);
  const updateData = { ...body };

  if (req.files?.thumbnail?.[0]) {
    const uploaded = await uploadOnCloudinary(req.files.thumbnail[0].path, false);
    
    if (!uploaded) throw new ApiError(500, "Thumbnail upload failed");
    if (caseStudy.thumbnail) await deleteFromCloudinary(caseStudy.thumbnail);
    updateData.thumbnail = uploaded;
  }

  if (req.files?.screenshots?.length) {
    const uploaded = await Promise.all(
      req.files.screenshots.map((file) => uploadOnCloudinary(file.path, false))
    );
    const newScreenshots = uploaded.filter(Boolean).map((url) => ({ url, caption: "" }));
    updateData.screenshots = [...(caseStudy.screenshots || []), ...newScreenshots];
  }

  const updated = await CaseStudy.findOneAndUpdate(
    { slug: req.params.slug },
    updateData,
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, "Case study updated", updated));
};

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────
export const deleteCaseStudy = async (req, res) => {
  const caseStudy = await CaseStudy.findOneAndDelete({ slug: req.params.slug });
  if (!caseStudy) throw new ApiError(404, "Case study not found");

  if (caseStudy.thumbnail) await deleteFromCloudinary(caseStudy.thumbnail);
  if (caseStudy.screenshots?.length) {
    await Promise.all(caseStudy.screenshots.map((s) => deleteFromCloudinary(s.url)));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Case study deleted successfully", { slug: req.params.slug }));
};

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
const parseJsonFields = (body) => {
  const arrayFields = ["techStack", "keyFeatures", "challenges", "results", "screenshots"];
  const parsed = { ...body };
  for (const field of arrayFields) {
    if (typeof parsed[field] === "string") {
      try { parsed[field] = JSON.parse(parsed[field]); }
      catch { /* leave as-is */ }
    }
  }
  // coerce featured string → boolean
  if (typeof parsed.featured === "string") {
    parsed.featured = parsed.featured === "true";
  }
  return parsed;
};