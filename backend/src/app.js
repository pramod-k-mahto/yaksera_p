import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import portfolioRouter from "./routes/portfolioRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import caseStudyRouter from "./routes/caseStudyRoutes.js";
import jobVacancyRouter from "./routes/jobVacancyRoutes.js";
import jobApplicationsRouter from "./routes/jobApplicationRoutes.js";
import serviceRouter from "./routes/servicesRoutes.js";
import testimonialRouter from "./routes/testimonialRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { ZodError } from "zod";
import ApiError from "./utils/ApiError.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ─── CORS ─────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://187.127.177.252:3000",
  "http://localhost:3000",
  "https://yaksera.com",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps / curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
// ─── Rate Limiters ────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ─── Routes ───────────────────────────────────────────────────────
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/portfolios", portfolioRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/job-vacancies", jobVacancyRouter);
app.use("/api/v1/job-applications", jobApplicationsRouter);
app.use("/api/v1/case-studies", caseStudyRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/users", authLimiter, userRouter);
app.use("/api/v1/testimonials", testimonialRouter);

// ─── Health Check ─────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is running 🚀" });
});

// ─── Swagger Docs ─────────────────────────────────────────────────
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Global Error Handler ─────────────────────────────────────────
app.use((error, req, res, next) => {
  console.error("🔥 ERROR:", error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation Error",
      errors: error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Database Validation Error",
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    return res.status(409).json({
      success: false,
      status: 409,
      message: `${field} already exists`,
      field,
      value,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: 400,
      message: `Invalid ${error.path}: ${error.value}`,
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.statusCode,
      message: error.message,
      errors: error.errors || null,
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: "Internal Server Error",
  });
});

export default app;
