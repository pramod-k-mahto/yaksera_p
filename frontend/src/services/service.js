import { apiClient } from "../api/client.js";

export const getServicesAll = async () => {
  return await apiClient("/api/v1/services");
};

export const getServiceBySlug = async (slug) => {
  return await apiClient(`/api/v1/services/${slug}`);
};

export const createService = async (formData) => {
  return await apiClient("/api/v1/services/create", {
    method: "POST",
    body: formData, // FormData — apiClient handles multipart automatically
  });
};

export const updateService = async (slug, formData) => {
  return await apiClient(`/api/v1/services/${slug}`, {
    method: "PATCH",
    body: formData,
  });
};

export const deleteService = async (slug) => {
  return await apiClient(`/api/v1/services/${slug}`, {
    method: "DELETE",
  });
};