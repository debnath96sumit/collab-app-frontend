import axios from "axios";
import { pushToast, TOAST_TYPES } from "../utils/toaster";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleResponseError = (error) => {
  const statusCode = error.response?.status || 500;
  const data = error.response?.data;

  const getFallbackMessage = () => {
    if (statusCode >= 500) return 'Something went wrong on the server';
    if (statusCode === 401) return 'Unauthorized request';
    if (statusCode === 403) return 'Access denied';
    if (statusCode === 404) return 'Requested resource was not found';
    return 'Request failed';
  };

  const getToastType = () => {
    if (statusCode >= 400 && statusCode < 500) return TOAST_TYPES.warning;
    if (statusCode >= 500) return TOAST_TYPES.error;
    return TOAST_TYPES.info;
  };

  const message = data?.message || getFallbackMessage();
  pushToast({ message, type: getToastType() });

  if (statusCode === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  return Promise.reject(error);
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
        return handleResponseError(error);
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return handleResponseError(error);
      }

      if (isRefreshing) {
        try {
          // Wait for the token refresh to finish
          const token = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = localStorage.getItem('access_token');

        // Make the refresh token request
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
          accessToken: currentToken || '',
          refreshToken: refreshToken
        });

        const refreshData = response.data;

        if (refreshData?.data?.accessToken) {
          const newToken = refreshData.data.accessToken;
          const newRefreshToken = refreshData.data.refreshToken || refreshToken;

          localStorage.setItem('access_token', newToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Refresh token invalid');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return handleResponseError(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return handleResponseError(error);
  }
);
export default axiosInstance;
