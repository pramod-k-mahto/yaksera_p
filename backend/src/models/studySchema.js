import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["Website", "Mobile App", "AI Solution", "SaaS", "E-Commerce", "Dashboard", "Other"],
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    projectDuration: {
      type: String,
      trim: true,
      default: "",
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    keyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],

    problem: {
      type: String,
      required: true,
    },

    solution: {
      type: String,
      required: true,
    },

    challenges: [
      {
        title: { type: String, trim: true },
        description: { type: String },
        solution: { type: String },
      },
    ],

    results: [
      {
        metric: { type: String, trim: true }, // e.g. "Page Load Time"
        value: { type: String, trim: true },  // e.g. "60% faster"
      },
    ],

    screenshots: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "" },
      },
    ],

    liveUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not set
// caseStudySchema.pre("save", function (next) {
//   if (!this.slug && this.title) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .trim()
//       .replace(/\s+/g, "-");
//   }
//   next();
// });

const CaseStudy = mongoose.model("CaseStudy", caseStudySchema);
export default CaseStudy;