import Portfolio from "../models/portfolioModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, {
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ── helpers ───────────────────────────────────────────────────────────────────

const uploadGallery = (files = []) =>
  Promise.all(files.map((f) => uploadOnCloudinary(f.path, false))).then((r) =>
    r.filter(Boolean)
  );

// ── CREATE ────────────────────────────────────────────────────────────────────

export const createPortfolio = async (req, res) => {
  if (!req.files?.image?.[0]) throw new ApiError(400, "Main image is required");

  const imageUrl = await uploadOnCloudinary(req.files.image[0].path, false);
  if (!imageUrl) throw new ApiError(500, "Failed to upload main image");

  const galleryUrls = await uploadGallery(req.files?.gallery);

  const exists = await Portfolio.findOne({ slug: req.validatedData.slug });
  if (exists) throw new ApiError(400, "Slug already exists");

  const portfolio = await Portfolio.create({
    ...req.validatedData,
    image: imageUrl,
    gallery: galleryUrls,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Portfolio created successfully", portfolio));
};

// ── READ ALL ──────────────────────────────────────────────────────────────────

export const getAllPortfolios = async (req, res) => {
  const data = await Portfolio.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, "All portfolios fetched", data));
};

// ── READ ONE ──────────────────────────────────────────────────────────────────

export const getSinglePortfolio = async (req, res) => {
  const { slug } = req.params;
  // Resolve by ObjectId (used by the admin edit page) or by slug (public URLs).
  const isObjectId = /^[a-f\d]{24}$/i.test(slug);
  const data = isObjectId
    ? await Portfolio.findById(slug)
    : await Portfolio.findOne({ slug });
  if (!data) throw new ApiError(404, "Portfolio not found");
  return res.status(200).json(new ApiResponse(200, "Portfolio fetched", data));
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

export const updatePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  if (!portfolio) throw new ApiError(404, "Portfolio not found");

  const data = { ...req.validatedData };

  // Replace main image if a new one was sent
  if (req.files?.image?.[0]?.path) {
    const imageUrl = await uploadOnCloudinary(req.files.image[0].path, false);
    if (!imageUrl) throw new ApiError(500, "Failed to upload main image");

    // await deleteFromCloudinary(portfolio.image); // optional cleanup
    data.image = imageUrl;
  }

  // Append or replace gallery
  if (req.files?.gallery?.length) {
    const newUrls = await uploadGallery(req.files.gallery);

    // Replace strategy (swap out old gallery entirely):
    // for (const url of portfolio.gallery) await deleteFromCloudinary(url);
    // data.gallery = newUrls;

    // Append strategy (add to existing gallery):
    data.gallery = [...portfolio.gallery, ...newUrls];
  }

  // Slug uniqueness check (only when slug is actually changing)
  if (data.slug && data.slug !== portfolio.slug) {
    const conflict = await Portfolio.findOne({ slug: data.slug });
    if (conflict) throw new ApiError(400, "Slug already exists");
  }

  const updated = await Portfolio.findByIdAndUpdate(
    req.params.id,
    { $set: data },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Portfolio updated", updated));
};

// ── DELETE ────────────────────────────────────────────────────────────────────

export const deletePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
  if (!portfolio) throw new ApiError(404, "Portfolio not found");

  // Optional: clean up all Cloudinary assets
  // await deleteFromCloudinary(portfolio.image);
  // for (const url of portfolio.gallery) await deleteFromCloudinary(url);

  return res
    .status(200)
    .json(new ApiResponse(200, "Portfolio deleted", { id: req.params.id }));
};