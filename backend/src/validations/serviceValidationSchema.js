import { z } from "zod";

const techStackSchema = z.object({
  name: z.string().min(1, "Tech name is required"),
  icon: z.string().url("Icon must be a valid URL"),
});

// NOTE: image/heroImage/mockupImage are files (multipart) — not validated here
// They are handled by multer + cloudinary in the controller
const serviceValidationSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),

  description: z
    .string({ required_error: "Description is required" })
    .min(10, "Description must be at least 10 characters"),

  detailDescription: z
    .string()
    .min(10, "Detail description must be at least 10 characters")
    .optional(),

  // booleans arrive as strings from multipart/form-data
  wide: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => v === true || v === "true")
    .optional(),

  tall: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => v === true || v === "true")
    .optional(),

  // techStack arrives as a JSON string from multipart/form-data
  techStack: z
    .union([
      z.array(techStackSchema),
      z.string().transform((val, ctx) => {
        try {
          return JSON.parse(val);
        } catch {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "techStack must be valid JSON" });
          return z.NEVER;
        }
      }),
    ])
    .optional(),

  order: z
    .union([z.number(), z.string().transform(Number)])
    .pipe(z.number().int().min(0, "Order must be 0 or greater"))
    .optional(),

  isActive: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .transform((v) => v === true || v === "true")
    .optional(),
});

// For PATCH routes — all fields optional
export const serviceUpdateSchema = serviceValidationSchema.partial();

export default serviceValidationSchema;