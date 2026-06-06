import { apiClient } from "../api/client.js";

export const getJobApplications = async () => {
  return await apiClient("/api/v1/job-applications");
};

export const applyJobApplications = async (formData) => {
  return await apiClient("/api/v1/job-applications/apply", {
    method: "POST",
    body: formData, // ✅ was "payload" — must be "body" to match apiClient
  });
};