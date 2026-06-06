import z from "zod";

const userValidation = z.object({
  name: z.string().min(3, "minimum 2 characters").trim(),
  email: z.email("invalid Email").toLowerCase().trim(),
  password: z.string().min(8, "Password must be 8 characters").trim(),
  phone: z.string().trim().min(10, "Phone number is too short"),
  address: z.string().trim().min(3, "Address most be 3 characters "),
  role: z.enum("admin", "user").default("user"),
});

export default userValidation;
