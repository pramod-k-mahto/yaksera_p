import { z } from "zod";

 const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(8, "password must be 8 characters").trim(),
});


export default loginSchema