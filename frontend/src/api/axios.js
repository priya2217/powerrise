import axios from "axios";

// Backend URL. API modules use paths like /auth/signup, so the base URL must
// include /api whether it comes from local .env or the production fallback.
const rawApiUrl =
  import.meta.env.VITE_API_URL || "https://powerrise.onrender.com/api";
const API_URL = rawApiUrl.replace(/\/$/, "").endsWith("/api")
  ? rawApiUrl.replace(/\/$/, "")
  : `${rawApiUrl.replace(/\/$/, "")}/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error"));
    }

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
