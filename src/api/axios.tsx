import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
  }
);

export default api;
