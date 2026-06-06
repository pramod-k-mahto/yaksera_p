import { apiClient } from "../api/client.js";
// http://localhost:9000/api/v1/job-vacancies
export const getTestimonials = async () => {
  return await apiClient("/api/v1/testimonials");
};
