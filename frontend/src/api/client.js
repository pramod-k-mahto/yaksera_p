import { getMe } from "../services/users";

const BASE_URL = import.meta.env.VITE_API_URL || "https://yaksera.onrender.com";

let isRefreshing = false;

const refreshToken = async () => {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const response = await fetch(`${BASE_URL}/api/v1/users/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Refresh failed");
    await getMe();
  } catch (error) {
    // Refresh failed — user needs to log in again
    console.warn("Token refresh failed:", error.message);
  } finally {
    isRefreshing = false;
  }
};

export const apiClient = async (
  endpoint,
  { method = "GET", body, headers = {} } = {},
) => {
  const isFormData = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: "include",
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (response.status === 401) {
    await refreshToken();
    throw new Error(data.message || "Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
