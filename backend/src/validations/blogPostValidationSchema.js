import { z } from "zod";

const blogPostValidationSchema = z.object({
  title: z.string().min(3).max(200),

  slug: z.string().min(3),

  category: z.string().min(2),

  tags: z.array(z.string()).optional(),

  highlight: z.coerce.boolean().optional(),

  excerpt: z.string().min(10).max(300),

  content: z.string().min(20),

  coverImage: z.string().url().optional(),

  author: z.string().min(2),

  status: z.enum(["draft", "published", "archived"]).optional(),

  views: z.number().optional(),
  publishedAt: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    }),

  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export default blogPostValidationSchema;
