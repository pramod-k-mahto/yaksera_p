import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import ProjectInquiry from "../models/projectInquiryModel.js";

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createProjectInquiry = async (req, res, next) => {
  try {
    const data = req.validatedData;

    const formattedAmount = new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: data.projectBudget.currency,
      maximumFractionDigits: 0,
    }).format(data.projectBudget.amount);

    data.projectBudget.formatted = formattedAmount;

    const inquiry = await ProjectInquiry.create(data);
    if (!inquiry) throw new ApiError(500, "Failed to create project inquiry");

    return res
      .status(201)
      .json(new ApiResponse(201, "Project inquiry submitted successfully", inquiry));
  } catch (error) {
    next(error);
  }
};

export const getAllProjectInquiries = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    // Fix: escape regex input to prevent ReDoS
    if (req.query.search) {
      const safeSearch = escapeRegex(req.query.search.trim().slice(0, 100));
      filter.$or = [
        { fullName: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      ProjectInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ProjectInquiry.countDocuments(filter),
    ]);

    return res.status(200).json(
      new ApiResponse(200, "Project inquiries fetched successfully", {
        inquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleProjectInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid project inquiry ID");
    }

    const inquiry = await ProjectInquiry.findById(id);
    if (!inquiry) throw new ApiError(404, "Project inquiry not found");

    return res
      .status(200)
      .json(new ApiResponse(200, "Project inquiry fetched successfully", inquiry));
  } catch (error) {
    next(error);
  }
};
