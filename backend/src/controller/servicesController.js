import Service from "../models/servicesModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";

const generateSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const createService = async (req, res, next) => {
  try {
    const { title, techStack, wide, tall, isActive, order, ...rest } = req.body;

    const slug = generateSlug(title);
    const exists = await Service.findOne({ slug });
    if (exists) throw new ApiError(400, "A service with this title already exists");

    if (!req.files?.image?.[0]) throw new ApiError(400, "Service image is required");
    const imageUrl = await uploadOnCloudinary(req.files.image[0].path, false);
    if (!imageUrl) throw new ApiError(500, "Failed to upload service image");

    let heroImageUrl, mockupImageUrl;
    if (req.files?.heroImage?.[0]) {
      heroImageUrl = await uploadOnCloudinary(req.files.heroImage[0].path, false);
    }
    if (req.files?.mockupImage?.[0]) {
      mockupImageUrl = await uploadOnCloudinary(req.files.mockupImage[0].path, false);
    }

    let parsedTechStack = [];
    if (techStack) {
      try {
        parsedTechStack = typeof techStack === "string" ? JSON.parse(techStack) : techStack;
      } catch {
        throw new ApiError(400, "techStack must be valid JSON");
      }
    }

    const service = await Service.create({
      ...rest,
      title,
      slug,
      image: imageUrl,
      heroImage: heroImageUrl,
      mockupImage: mockupImageUrl,
      techStack: parsedTechStack,
      wide: wide === "true" || wide === true,
      tall: tall === "true" || tall === true,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
      order: order ? Number(order) : 0,
    });

    return res.status(201).json(new ApiResponse(201, "Service created", service));
  } catch (error) {
    next(error);
  }
};

export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    return res.status(200).json(new ApiResponse(200, "Services fetched", services));
  } catch (error) {
    next(error);
  }
};

// Fix: was querying by _id using a slug param — now correctly queries by slug
export const getSingleService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");
    return res.status(200).json(new ApiResponse(200, "Service fetched", service));
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { title, techStack, wide, tall, isActive, order, ...rest } = req.body;

    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");

    if (title && title !== service.title) {
      const newSlug = generateSlug(title);
      const slugExists = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (slugExists) throw new ApiError(400, "A service with this title already exists");
      service.slug = newSlug;
      service.title = title;
    }

    if (req.files?.image?.[0]) {
      await deleteFromCloudinary(service.image);
      const imageUrl = await uploadOnCloudinary(req.files.image[0].path, false);
      if (!imageUrl) throw new ApiError(500, "Failed to upload service image");
      service.image = imageUrl;
    }
    if (req.files?.heroImage?.[0]) {
      if (service.heroImage) await deleteFromCloudinary(service.heroImage);
      service.heroImage = await uploadOnCloudinary(req.files.heroImage[0].path, false);
    }
    if (req.files?.mockupImage?.[0]) {
      if (service.mockupImage) await deleteFromCloudinary(service.mockupImage);
      service.mockupImage = await uploadOnCloudinary(req.files.mockupImage[0].path, false);
    }

    if (techStack) {
      try {
        service.techStack = typeof techStack === "string" ? JSON.parse(techStack) : techStack;
      } catch {
        throw new ApiError(400, "techStack must be valid JSON");
      }
    }

    if (wide !== undefined) service.wide = wide === "true" || wide === true;
    if (tall !== undefined) service.tall = tall === "true" || tall === true;
    if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;
    if (order !== undefined) service.order = Number(order);

    Object.assign(service, rest);
    await service.save();

    return res.status(200).json(new ApiResponse(200, "Service updated", service));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) throw new ApiError(404, "Service not found");

    if (service.image) await deleteFromCloudinary(service.image);
    if (service.heroImage) await deleteFromCloudinary(service.heroImage);
    if (service.mockupImage) await deleteFromCloudinary(service.mockupImage);

    await service.deleteOne();
    return res.status(200).json(new ApiResponse(200, "Service deleted", null));
  } catch (error) {
    next(error);
  }
};
