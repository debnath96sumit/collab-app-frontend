import axios from "axios";
import { pushToast, TOAST_TYPES } from "../utils/toaster";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Route classification ─────────────────────────────────────────────────────

// These routes get a toast on 401 but never attempt token refresh
// (401 means wrong credentials, not expired session)
const NO_REFRESH_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/forgot-password',
];

// These routes suppress toasts entirely — component handles its own error UI
const SILENT_ERROR_ROUTES = [
  '/documents/invite-validate',
];

const isNoRefreshRoute = (url = '') =>
  NO_REFRESH_ROUTES.some((route) => url.includes(route));

const isSilentRoute = (url = '') =>
  SILENT_ERROR_ROUTES.some((route) => url.includes(route));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getToastType = (statusCode) => {
  if (statusCode >= 500) return TOAST_TYPES.error;
  if (statusCode >= 400) return TOAST_TYPES.warning;
  return TOAST_TYPES.info;
};

const getFallbackMessage = (statusCode) => {
  if (!statusCode) return 'Network error — check your connection';
  if (statusCode >= 500) return 'Something went wrong on the server';
  if (statusCode === 403) return 'Access denied';
  if (statusCode === 404) return 'Requested resource was not found';
  return 'Request failed';
};

const clearAuthAndRedirect = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  const redirect = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.href = `/login?redirect=${redirect}`;
};

const handleResponseError = (error) => {
  const statusCode = error.response?.status;
  const message = error.response?.data?.message || getFallbackMessage(statusCode);

  if (!isSilentRoute(error.config?.url)) {
    pushToast({ message, type: getToastType(statusCode) });
  }

  return Promise.reject(error);
};

// ─── Token refresh queue ──────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// ─── Response interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    // 1. No response — network error or timeout
    if (!error.response) {
      pushToast({
        message: 'Network error — check your connection',
        type: TOAST_TYPES.error,
      });
      return Promise.reject(error);
    }

    // 2. Non-401 — show toast and reject
    if (statusCode !== 401) {
      return handleResponseError(error);
    }

    // 3. 401 on login/register etc. — show toast, no refresh attempt
    //    401 on silent routes — suppress toast, component handles it
    if (isNoRefreshRoute(originalRequest?.url) || isSilentRoute(originalRequest?.url)) {
      return handleResponseError(error);
    }

    // 4. 401 and already retried — refresh failed, session dead
    if (originalRequest?._retry) {
      processQueue(error, null);
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // 5. 401 and no refresh token stored — nothing to refresh with
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // 6. 401 and a refresh is already in progress — queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // 7. Attempt token refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/auth/refresh-token`,
        { refreshToken }
      );

      const refreshData = response.data;

      if (!refreshData?.data?.accessToken) {
        throw new Error('Invalid refresh response');
      }

      const newToken = refreshData.data.accessToken;
      const newRefreshToken = refreshData.data.refreshToken || refreshToken;

      localStorage.setItem('access_token', newToken);
      localStorage.setItem('refresh_token', newRefreshToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;