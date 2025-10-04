// src/api/authApi.js
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    toast.success("Login successful 🎉");
    return response;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    throw error; // rethrow so caller knows it failed
  }
};

export const register = (userData) =>
  axiosInstance.post("/auth/register", userData);

export const logout = () => axiosInstance.post("/auth/logout");
