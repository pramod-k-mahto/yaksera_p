import { apiClient } from "../api/client.js";

export const getJobVacancies = async () => {
  return await apiClient("/api/v1/job-vacancies");
};

export const getJobVacancyById = async (id) => {
  return await apiClient(`/api/v1/job-vacancies/${id}`);
};

export const createJobVacancies = async (payload) => {
  return await apiClient("/api/v1/job-vacancies/create", {
    method: "POST",
    body: payload,
  });
};

export const updateJobVacancy = async (id, payload) => {
  return await apiClient(`/api/v1/job-vacancies/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const deleteJobVacancy = async (id) => {
  return await apiClient(`/api/v1/job-vacancies/${id}`, {
    method: "DELETE",
  });
};