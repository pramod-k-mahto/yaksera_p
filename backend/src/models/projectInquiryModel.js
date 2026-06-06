// models/projectInquiry.model.js

import mongoose from "mongoose";

const projectInquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    phone: {
      countryCode: {
        type: String,
        required: [true, "Country code is required"],
        trim: true,
      },
      number: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\d+$/, "Phone number must contain digits only"],
        minlength: [7, "Phone number is too short"],
        maxlength: [15, "Phone number is too long"],
      },
    },

    projectBudget: {
      currency: {
        type: String,
        required: [true, "Currency is required"],
        // enum with custom message + set transformer to actually enforce uppercase
        enum: {
          values: ["NPR", "USD", "INR"],
          message: "Invalid currency: {VALUE}. Must be NPR, USD, or INR.",
        },
        set: (v) => v?.toUpperCase(),
      },

      amount: {
        type: Number,
        required: [true, "Budget amount is required"],
        min: [1, "Amount must be greater than 0"],
      },

      formatted: {
        type: String,
        trim: true,
      },
    },

    projectDetails: {
      type: String,
      required: [true, "Project details are required"],
      trim: true,
      minlength: [10, "Project details must be at least 10 characters"],
    },

    // Server-controlled field — never set from client input
    status: {
      type: String,
      enum: {
        values: ["pending", "in_progress", "completed", "rejected"],
        message: "Invalid status: {VALUE}",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const ProjectInquiry = mongoose.model("ProjectInquiry", projectInquirySchema);

export default ProjectInquiry;
