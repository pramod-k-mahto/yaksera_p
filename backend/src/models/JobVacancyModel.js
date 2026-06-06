import mongoose from "mongoose";

const jobVacancySchema = new mongoose.Schema(
  {
    // Job Title
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    // Department
    dept: {
      type: String,
      required: true,
      trim: true,
    },

    // Employment Type
    type: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "remote"],
      default: "full-time",
    },

    // Office / Remote Location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Salary Range
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "USD",
      },
      isVisible: {
        type: Boolean,
        default: false,
      },
    },

    // Experience Required
    experience: {
      type: String,
      required: true,
      trim: true,
    },

    // Skills / Keywords
    tags: {
      type: [String],
      default: [],
    },

    // Main Description
    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    // Job Responsibilities
    responsibilities: {
      type: [String],
      default: [],
    },

    // Requirements
    requirements: {
      type: [String],
      default: [],
    },

    // Benefits
    benefits: {
      type: [String],
      default: [],
    },

    // Education Requirement
    education: {
      type: String,
      trim: true,
    },

    // Number of openings
    openings: {
      type: Number,
      default: 1,
    },

    // Last application date
    applicationDeadline: {
      type: Date,
    },

    // Who posted the job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Featured Job
    featured: {
      type: Boolean,
      default: false,
    },

    // Job Status
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

const JobVacancy = mongoose.model("JobVacancy", jobVacancySchema);

export default JobVacancy;
