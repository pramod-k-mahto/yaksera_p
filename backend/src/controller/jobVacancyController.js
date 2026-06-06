import JobVacancy from "../models/JobVacancyModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// CREATE
export const createJob = async (req, res) => {
  const job = await JobVacancy.create(req.body);
  return res.status(201).json(new ApiResponse(201, "Job created successfully", job));
};

// READ ALL (pagination + filtering)
export const getAllJobs = async (req, res) => {
  const { page = 1, limit = 10, status, featured } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured === "true";

  const [jobs, total] = await Promise.all([
    JobVacancy.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    JobVacancy.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Jobs fetched successfully", jobs, {
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    })
  );
};

// READ ONE
export const getSingleJob = async (req, res) => {
  const job = await JobVacancy.findById(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, "Job fetched successfully", job));
};

// UPDATE
export const updateJob = async (req, res) => {
  const job = await JobVacancy.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, "Job updated successfully", job));
};

// DELETE
export const deleteJob = async (req, res) => {
  const job = await JobVacancy.findByIdAndDelete(req.params.id);
  if (!job) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, "Job deleted successfully", { id: req.params.id }));
};