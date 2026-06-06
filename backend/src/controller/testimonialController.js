import Testimonial from "../models/testimonialModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// CREATE
export const createTestimonial = async (req, res) => {
  const testimonial = await Testimonial.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Testimonial created",testimonial));
};

// GET ALL
export const getAllTestimonials = async (req, res) => {
  const data = await Testimonial.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Testimonials fetched",data));
};

// GET SINGLE
export const getSingleTestimonial = async (req, res) => {
  const data = await Testimonial.findById(req.params.id);

  if (!data) {
    throw new ApiError(404, "Testimonial not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Testimonial fetched",data));
};