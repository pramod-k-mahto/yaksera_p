import { apiClient } from "../api/client.js";

export const getPortfolios = async () => {
  return await apiClient("/api/v1/portfolios");
};

export const createPortfolio = async (formData) => {
  return await apiClient("/api/v1/portfolios/create", {
    method: "POST",
    body: formData,
  });
};

export const updatePortfolio = async (id, formData) => {
  return await apiClient(`/api/v1/portfolios/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const deletePortfolio = async (id) => {
  return await apiClient(`/api/v1/portfolios/${id}`, {
    method: "DELETE",
  });
};