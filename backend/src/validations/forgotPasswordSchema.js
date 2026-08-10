import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email").toLowerCase().trim(),
});

export default forgotPasswordSchema;
