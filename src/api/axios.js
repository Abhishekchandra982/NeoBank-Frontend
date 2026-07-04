import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://neobank-vfvw.onrender.com",
});

// Add interceptor to attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;