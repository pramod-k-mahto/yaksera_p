import { boolean } from "zod";
import ApiError from "../utils/ApiError.js";
const validate = (schema) => (req, res, next) => {
  // console.log(req.body);

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  req.validatedData = result.data; // ← this line is missing

  next();
};

export default validate;
