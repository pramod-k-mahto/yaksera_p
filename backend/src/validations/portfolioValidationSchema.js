import { z } from "zod";

const portfolioValidationSchema = z.object({
  title: z.string().min(3).max(150),

  slug: z.string().min(3),

  category: z.string().min(2),

  // ✅ enum values now match the model exactly
  type: z
    .enum([
      "Ui/Ux",
      "fullStack",
      "Ai Automation",
      "Web Application",
      "Web Development",
      "Mobile App",
    ])
    .optional(),

  description: z.string().min(10),

  // image and gallery come from multer — not validated as URLs in body
  image: z.string().optional(),
  gallery: z.array(z.string()).optional(),

  // multipart form-data sends a single tag as a string and multiple as an
  // array — normalise both (and empty) to an array of strings.
  tags: z
    .preprocess(
      (v) => (v === undefined || v === null || v === "" ? [] : Array.isArray(v) ? v : [v]),
      z.array(z.string()),
    )
    .optional(),

  status: z.enum(["draft", "published", "archived"]).optional(),

  featured: z.coerce.boolean().optional(),
  // ✅ allow empty string OR a valid URL
  projectUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

export default portfolioValidationSchema;
