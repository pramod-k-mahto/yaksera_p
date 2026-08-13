import { getMe } from "../services/users";

const rawBaseUrl = import.meta.env.VITE_API_URL || "https://yaksera.com/";

// Guard against Mixed Content: if the app is served over HTTPS but the API base
// is an http:// URL, the browser blocks every request ("Failed to fetch").
// Upgrade to https so the request can actually go through. (An http page is
// unaffected.) Fix the deployed VITE_API_URL to an https URL to avoid relying
// on this fallback.
const BASE_URL =
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  rawBaseUrl.startsWith("http://")
    ? rawBaseUrl.replace(/^http:\/\//, "https://")
    : rawBaseUrl;

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
    // console.warn("Token refresh failed:", error.message);
  } finally {
    isRefreshing = false;
  }
};

// Default per-request timeout so a hung/unreachable backend fails fast instead
// of leaving the UI stuck on a loading state indefinitely.
const REQUEST_TIMEOUT_MS = 15000;

export const apiClient = async (
  endpoint,
  { method = "GET", body, headers = {}, timeout = REQUEST_TIMEOUT_MS } = {},
) => {
  const isFormData = body instanceof FormData;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      credentials: "include",
      signal: controller.signal,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    // Network error / server unreachable
    throw new Error("Unable to reach the server. Please try again later.");
  } finally {
    clearTimeout(timer);
  }

  // Response may not be JSON (e.g. 502 HTML page, empty 204) — parse defensively.
  let data = {};
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (response.status === 401) {
    await refreshToken();
    throw new Error(data.message || "Session expired. Please log in again.");
  }

  if (!response.ok) {
    // Surface per-field validation details when the server provides them,
    // instead of a bare "Validation failed".
    const details = Array.isArray(data.errors)
      ? data.errors
          .map((e) => (e?.field ? `${e.field}: ${e.message}` : e?.message))
          .filter(Boolean)
          .join(" · ")
      : "";
    const base = data.message || "Something went wrong";
    throw new Error(details ? `${base} — ${details}` : base);
  }

  return data;
};
