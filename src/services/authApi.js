// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const login = async (credentials) =>
await axiosInstance.post("/auth/login", credentials);

export const register = (userData) =>
  axiosInstance.post("/auth/register", userData);

export const logout = () => axiosInstance.post("/auth/logout");
