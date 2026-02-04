import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// This runs BEFORE every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// This runs AFTER every response (including errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API call failed:", error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "An error occurred";

      if (status === 401) {
        //Unauthorized
        alert("Session expired. Please login again.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      } else if (status === 404) {
        //Not found
        alert("Resource not found");
      } else {
        alert(message);
      }
    } else if (error.request) {
      alert("Network error. Please check your connection.");
    } else {
      alert("An unexpected error occurred");
    }

    return Promise.reject(error);
  },
);

export default api;
