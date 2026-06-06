import { apiClient } from "../api/client.js";

export const getAllUsers = async () => {
  return await apiClient("/api/v1/users");
};

export const registerUser = async (formData) => {
  return await apiClient("/api/v1/users/register", {
    method: "POST",
    body: formData,
  });
};

export const login = async (user) => {
  return await apiClient("/api/v1/users/login", {
    method: "POST",
    body: user,
  });
};

// Fix: was GET, now POST to match updated backend route
export const logout = async () => {
  return await apiClient("/api/v1/users/logout", {
    method: "POST",
  });
};

export const verifyEmail = async (token) => {
  return await apiClient(`/api/v1/users/verify-email/${token}`);
};

export const getMe = async () => {
  return await apiClient("/api/v1/users/me", {
    method: "GET",
  });
};
