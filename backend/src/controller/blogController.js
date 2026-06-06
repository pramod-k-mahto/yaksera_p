// blogPostController.js  —  full CRUD

import BlogPost from "../models/blogPostModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js"; // add this export if needed

// ── helpers ──────────────────────────────────────────────────────────────────

function parseBlogBody(data) {
  if (data.publishedAt) {
    data.publishedAt = new Date(data.publishedAt);
  } else {
    delete data.publishedAt;
  }

  if (typeof data.tags === "string") {
    data.tags = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
  }
  if (!Array.isArray(data.tags)) data.tags = [];

  if (!data.seo || typeof data.seo !== "object") {
    data.seo = {
      metaTitle: data["seo[metaTitle]"] || "",
      metaDescription: data["seo[metaDescription]"] || "",
      keywords: [],
    };
    delete data["seo[metaTitle]"];
    delete data["seo[metaDescription]"];
  }
  if (typeof data.seo.keywords === "string") {
    data.seo.keywords = data.seo.keywords
      ? data.seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];
  }
  if (!Array.isArray(data.seo.keywords)) data.seo.keywords = [];

  if (typeof data.highlight === "string") {
    data.highlight = data.highlight === "true";
  }

  return data;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export const createBlog = async (req, res, next) => {
  try {
    const coverFile = req.files?.coverImage?.[0]?.path;
    if (!coverFile) throw new ApiError(400, "Cover image is required");

    const imageUrl = await uploadOnCloudinary(coverFile, false);
    if (!imageUrl) throw new ApiError(500, "Failed to upload cover image");

    const data = parseBlogBody({ ...req.body });
    data.coverImage = imageUrl;

    const blog = await BlogPost.create(data);
    return res.status(201).json(new ApiResponse(201, "Blog created", blog));
  } catch (error) {
    next(error);
  }
};

// ── READ ALL ──────────────────────────────────────────────────────────────────

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find()
      .sort({ createdAt: -1 })
      .select("-content");
    return res.status(200).json(new ApiResponse(200, "Blogs fetched", blogs));
  } catch (error) {
    next(error);
  }
};

// ── READ ONE  (supports both ObjectId and slug) ───────────────────────────────

export const getSingleBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Try ObjectId first, fall back to slug field
    const isObjectId = /^[a-f\d]{24}$/i.test(slug);
    const query = isObjectId ? { _id: slug } : { slug };

    const blog = await BlogPost.findOne(query);
    if (!blog) throw new ApiError(404, "Blog not found");

    return res.status(200).json(new ApiResponse(200, "Blog fetched", blog));
  } catch (error) {
    next(error);
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

export const updateBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    const data = parseBlogBody({ ...req.body });

    // Replace cover image if a new one was uploaded
    if (req.files?.coverImage?.[0]?.path) {
      const imageUrl = await uploadOnCloudinary(
        req.files.coverImage[0].path,
        false
      );
      if (!imageUrl) throw new ApiError(500, "Failed to upload cover image");

      // Optional: delete old image from Cloudinary
      // if (blog.coverImage) await deleteFromCloudinary(blog.coverImage);

      data.coverImage = imageUrl;
    }

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return res.status(200).json(new ApiResponse(200, "Blog updated", updated));
  } catch (error) {
    next(error);
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────

export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found");

    // Optional: clean up Cloudinary asset
    // if (blog.coverImage) await deleteFromCloudinary(blog.coverImage);

    return res
      .status(200)
      .json(new ApiResponse(200, "Blog deleted", { id: req.params.id }));
  } catch (error) {
    next(error);
  }
};

// ── INCREMENT VIEWS ───────────────────────────────────────────────────────────

export const updateBlogViews = async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) throw new ApiError(404, "Blog not found");
    return res.status(200).json(new ApiResponse(200, "Views updated", blog));
  } catch (error) {
    next(error);
  }
};