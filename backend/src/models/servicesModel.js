import mongoose from "mongoose";

const techStackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    // ── Services grid (Services.jsx) ──────────────────
    title:       { type: String, required: true, trim: true, minlength: 3, maxlength: 150 },
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true, minlength: 10 },
    image:       { type: String, required: true, trim: true },
    wide:        { type: Boolean, default: false },
    tall:        { type: Boolean, default: false },

    // ── ServicesDetail page (ServicesDetail.jsx) ──────
    heroImage:         { type: String, trim: true },
    detailDescription: { type: String, trim: true },
    mockupImage:       { type: String, trim: true },
    techStack:         { type: [techStackSchema], default: [] },

    // ── Meta ──────────────────────────────────────────
    order:    { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ✅ ADD 1 — slug auto-generation
// serviceSchema.pre("save", function (next) {
//   if (this.isModified("title")) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9-]/g, "");
//   }
//   next();
// });

// ✅ ADD 2 — compound index for grid query: find({ isActive: true }).sort({ order: 1 })
serviceSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("Service", serviceSchema);