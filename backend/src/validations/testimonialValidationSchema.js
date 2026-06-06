import { z } from "zod";

const testimonialValidationSchema = z.object({
  name: z.string().min(2).max(100),

  company: z.string().min(2),

  role: z.string().min(2),

  message: z.string().min(10),

  rating: z.number().min(1).max(5),

  avatar: z.string().url().optional(),

  status: z.enum(["draft", "published", "archived"]).optional(),

  featured: z.boolean().optional(),
});

export default testimonialValidationSchema;