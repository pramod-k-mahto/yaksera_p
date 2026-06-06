import { z } from "zod";

const jobApplicationValidationSchema = z.object({
  // ✅ vacancy comes from form — can be empty string if no vacancyId passed
  vacancy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid vacancy ID")
    .optional()
    .or(z.literal("")),

  name: z.string().min(2, "Name must be at least 2 characters").max(100),

  email: z.string().email("Invalid email address"),

  phone: z.string().min(6, "Phone number too short"),

  role: z.string().min(2, "Role is required"),

  experience: z.string().min(1, "Experience is required"),

  location: z.string().min(2, "Location is required"),

  // ✅ FormData sends skills as "skills[]" key with string or array
  skills: z.union([z.array(z.string()), z.string()]).optional(),
  "skills[]": z.union([z.array(z.string()), z.string()]).optional(),

  coverLetter: z.string().optional().default(""),

  // ✅ Allow empty string for optional URL fields
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),

  status: z
    .enum(["pending", "reviewed", "shortlisted", "interview", "hired", "rejected"])
    .optional(),
});

export default jobApplicationValidationSchema;