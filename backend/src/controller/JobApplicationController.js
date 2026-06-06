import JobApplication from "../models/JobApplication.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// APPLY JOB
export const applyJob = async (req, res, next) => {
  try {
    // ✅ Safe optional chaining — won't crash if resume is missing
    const resumeFile = req.files?.resume?.[0];

    if (!resumeFile) {
      throw new ApiError(400, "Resume file is required");
    }

    // ✅ Validate PDF mimetype on server side too
    if (resumeFile.mimetype !== "application/pdf") {
      throw new ApiError(400, "Only PDF files are accepted for resume");
    }

    const cloudinaryUrl = await uploadOnCloudinary(resumeFile.path, true);
    if (!cloudinaryUrl) {
      throw new ApiError(500, "Failed to upload resume, please try again");
    }

    const {
      vacancy,
      name,
      email,
      phone,
      role,
      experience,
      location,
      coverLetter,
      portfolio,
      linkedin,
      github,
    } = req.body;

    // ✅ Handle skills from FormData — can come as array, comma string, or skills[]
    let skills = req.body["skills[]"] ?? req.body.skills ?? [];
    if (typeof skills === "string") {
      skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(skills)) {
      skills = [skills].filter(Boolean);
    }

    // ✅ Validate required fields from body
    if (!vacancy) throw new ApiError(400, "Vacancy ID is required");
    if (!name?.trim()) throw new ApiError(400, "Name is required");
    if (!email?.trim()) throw new ApiError(400, "Email is required");
    if (!phone?.trim()) throw new ApiError(400, "Phone is required");
    if (!role?.trim()) throw new ApiError(400, "Role is required");
    if (!experience?.trim()) throw new ApiError(400, "Experience is required");
    if (!location?.trim()) throw new ApiError(400, "Location is required");

    const application = await JobApplication.create({
      vacancy,
      name,
      email,
      phone,
      role,
      experience,
      location,
      skills,
      resume: cloudinaryUrl,   // ✅ Cloudinary URL, not req.body.resume
      coverLetter: coverLetter || "",
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      github: github || "",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Job application submitted", application));
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getAllApplications = async (req, res, next) => {
  try {
    const data = await JobApplication.find()
      .populate("vacancy")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, "Applications fetched", data));
  } catch (error) {
    next(error);
  }
};

// GET SINGLE
export const getSingleApplication = async (req, res, next) => {
  try {
    const data = await JobApplication.findById(req.params.id).populate("vacancy");

    if (!data) {
      throw new ApiError(404, "Application not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Application fetched", data));
  } catch (error) {
    next(error);
  }
};

// UPDATE STATUS
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const validStatuses = ["pending", "reviewed", "shortlisted", "interview", "hired", "rejected"];

    if (!validStatuses.includes(req.body.status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const data = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    if (!data) {
      throw new ApiError(404, "Application not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Status updated", data));
  } catch (error) {
    next(error);
  }
};