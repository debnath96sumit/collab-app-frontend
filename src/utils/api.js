import axiosInstance from "./axiosInstance";

export const AuthAPI = {
  signup: async ({ fullName, email, phone, password }) => axiosInstance.post('/v1/auth/register', { fullName, email, phone, password }),

  login: async ({ email, password }) => axiosInstance.post('/v1/auth/login', { email, password }),

  socialSignIn: async (provider, code, redirectUri) => axiosInstance.post('/v1/auth/social-signin', { provider, code, redirectUri }),

  githubSignIn: async () => axiosInstance.get('/v1/auth/github'),

  logout: async () => axiosInstance.get('/v1/auth/logout'),

  forgotPassword: async ({ email }) => axiosInstance.post('/v1/auth/forgot-password', { email }),

  verifyOTP: async ({ email, code, type = 'forgot_password_verify' }) => axiosInstance.post('/v1/auth/verify-email', { email, code, type }),

  resetPassword: async ({ email, newPassword }) => axiosInstance.post('/v1/auth/reset-password', { email, newPassword }),

  refreshToken: async (accessToken, refreshToken) => axiosInstance.post('/v1/auth/refresh-token', { accessToken, refreshToken }),
};

export const UserAPI = {
  getProfile: async () => axiosInstance.get('/v1/user/profile-details'),

  updateProfile: async (userData) => axiosInstance.post('/v1/user/update-profile', userData),

  changePassword: async ({ oldPassword, newPassword }) => axiosInstance.post('/v1/user/change-password', { oldPassword, newPassword }),
};

export const DocumentAPI = {
  getDocument: async (documentId) => await axiosInstance.get(`/v1/documents/${documentId}`),

  getAllDocuments: async () => await axiosInstance.get(`/v1/documents`),

  updateDocument: async (documentId, data) => await axiosInstance.put(`/v1/documents/${documentId}`, data),

  createDocument: async (data) => await axiosInstance.post(`/v1/documents`, data),

  deleteDocument: async (documentId) => await axiosInstance.delete(`/v1/documents/${documentId}`),
}