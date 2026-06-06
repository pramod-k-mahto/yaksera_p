import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    // Related Job
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobVacancy",
      required: true,
    },

    // Applicant Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Current Position / Desired Role
    role: {
      type: String,
      required: true,
      trim: true,
    },

    // Experience
    experience: {
      type: String,
      required: true,
      trim: true,
    },

    // Current Location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Skills
    skills: {
      type: [String],
      default: [],
    },

    // Resume URL
    resume: {
      type: String,
      required: true,
    },

    // Cover Letter
    coverLetter: {
      type: String,
      default: "",
    },

    // Portfolio / Github / LinkedIn
    portfolio: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    // HR Notes
    hrNotes: {
      type: String,
      default: "",
    },

    // Application Status
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "interview",
        "hired",
        "rejected",
      ],
      default: "pending",
    },

    // Interview Date
    interviewDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;