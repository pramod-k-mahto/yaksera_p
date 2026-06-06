// validations/projectInquiry.validation.js

import { z } from "zod";

const projectInquiryValidationSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
    })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .email("Invalid email address"),

  phone: z.object({
    countryCode: z
      .string({
        required_error: "Country code is required",
      })
      .trim()
      .min(1, "Country code is required"),
    number: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .regex(/^\d+$/, "Phone number must contain digits only")
      .min(7, "Phone number is too short") // match frontend
      .max(15, "Phone number is too long"),
  }),

  projectBudget: z.object({
    currency: z.enum(["NPR", "USD", "INR"], {
      errorMap: () => ({
        message: "Invalid currency selected",
      }),
    }),

    amount: z
      .number({
        required_error: "Budget amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be greater than 0"),

    formatted: z.string().optional(),
  }),

  projectDetails: z
    .string({
      required_error: "Project details are required",
    })
    .trim()
    .min(10, "Project details must be at least 10 characters"),

  // ── status is intentionally excluded ────────────────────────────────────────
  // Status is a server-controlled field (Mongoose default: "pending").
  // Accepting it from the client would allow users to bypass the workflow.
});

export default projectInquiryValidationSchema;
