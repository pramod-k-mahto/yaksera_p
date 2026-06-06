import { z } from "zod";

const jobVacancyValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),

  dept: z
    .string()
    .trim()
    .min(2, "Department is required"),

  type: z
    .enum([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "remote",
    ])
    .default("full-time"),

  location: z
    .string()
    .trim()
    .min(2, "Location is required"),

  experience: z
    .string()
    .trim()
    .min(1, "Experience is required"),

  tags: z
    .array(z.string().trim().min(1))
    .default([]),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  responsibilities: z
    .array(z.string().trim().min(1))
    .default([]),

  requirements: z
    .array(z.string().trim().min(1))
    .default([]),

  benefits: z
    .array(z.string().trim().min(1))
    .default([]),

  education: z
    .string()
    .trim()
    .optional(),

  openings: z
    .number()
    .int()
    .positive()
    .default(1),

  applicationDeadline: z
    .string()
    .datetime()
    .optional(),

  featured: z
    .boolean()
    .default(false),

  salary: z
    .object({
      min: z.number().nonnegative().optional(),
      max: z.number().nonnegative().optional(),

      currency: z
        .string()
        .default("USD"),

      isVisible: z
        .boolean()
        .default(false),
    })
    .optional(),

  status: z
    .enum(["open", "closed", "draft"])
    .default("open"),
});

export default jobVacancyValidationSchema;