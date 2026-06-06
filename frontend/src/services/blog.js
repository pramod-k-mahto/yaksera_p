import { apiClient } from "../api/client.js";

export const getBlogsAll = async () => {
  return await apiClient("/api/v1/blogs");
};

export const getBlogById = async (id) => {
  return await apiClient(`/api/v1/blogs/${id}`);
};

export const createBlog = async (formData) => {
  return await apiClient("/api/v1/blogs/create", {
    method: "POST",
    body: formData,
  });
};

export const updateBlog = async (id, formData) => {
  return await apiClient(`/api/v1/blogs/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const deleteBlog = async (id) => {
  return await apiClient(`/api/v1/blogs/${id}`, {
    method: "DELETE",
  });
};