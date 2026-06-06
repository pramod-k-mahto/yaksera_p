import { apiClient } from "../api/client.js";

const BASE = "/api/v1/case-studies";

// GET ALL  (supports ?category=Website&featured=true)
export const getAllCaseStudies = async () => {
  return await apiClient("/api/v1/case-studies");
};

// GET SINGLE
export const getSingleCaseStudy = async (id) => {
  return await apiClient(`${BASE}/${id}`);
};

// CREATE  — data is FormData (thumbnail + screenshots + JSON-stringified arrays)
export const createCaseStudy = async (formData) => {
  return await apiClient(BASE, {
    method: "POST",
    body: formData,
    // !! do NOT set Content-Type — browser sets it automatically with boundary
  });
};

// UPDATE  — data can be FormData (if files changed) or plain object
export const updateCaseStudy = async (slug, data) => {
  const isFormData = data instanceof FormData;
  return await apiClient(`${BASE}/${slug}`, {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
    ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
  });
};

// DELETE
export const deleteCaseStudy = async (slug) => {
  return await apiClient(`${BASE}/${slug}`, {
    method: "DELETE",
  });
};