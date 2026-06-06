import { z } from "zod";

const caseStudyValidationSchema = z.object({
  title: z.string().min(3).max(200).trim(),

  slug: z.string().min(3).toLowerCase().trim().optional(),

  category: z.enum([
    "Website",
    "Mobile App",
    "AI Solution",
    "SaaS",
    "E-Commerce",
    "Dashboard",
    "Other",
  ]),

  // thumbnail is a FILE — validated in controller, not here
  // removing it from zod so multer-uploaded files don't fail validation

  shortDescription: z.string().min(10).max(300).trim(),

  industry: z.string().trim().optional(),

  projectDuration: z.string().trim().optional(),

  techStack: z
    .union([z.array(z.string().trim()), z.string()])
    .transform((v) => {
      if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    })
    .optional(),

  keyFeatures: z
    .union([z.array(z.string().trim()), z.string()])
    .transform((v) => {
      if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    })
    .optional(),

  problem: z.string().min(10),

  solution: z.string().min(10),

  challenges: z
    .union([
      z.array(z.object({
        title: z.string().trim().optional(),
        description: z.string().optional(),
        solution: z.string().optional(),
      })),
      z.string(),
    ])
    .transform((v) => {
      if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    })
    .optional(),

  results: z
    .union([
      z.array(z.object({
        metric: z.string().trim(),
        value: z.string().trim(),
      })),
      z.string(),
    ])
    .transform((v) => {
      if (typeof v === "string") {
        try { return JSON.parse(v); } catch { return []; }
      }
      return v;
    })
    .optional(),

  liveUrl: z.string().url().optional().or(z.literal("")),

  githubUrl: z.string().url().optional().or(z.literal("")),

  // FormData sends "true"/"false" strings — handle both
  featured: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === "true")
    .optional(),

  order: z
    .union([z.number(), z.string()])
    .transform((v) => Number(v))
    .pipe(z.number().int().nonnegative())
    .optional(),

  status: z.enum(["Draft", "Published"]).optional(),
});

export default caseStudyValidationSchema;