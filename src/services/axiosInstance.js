// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your backend URL
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors (for auth token, errors, etc.)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/"; // or use react-router
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
