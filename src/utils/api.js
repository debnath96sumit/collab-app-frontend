import axiosInstance from "./axiosInstance";

export const AuthAPI = {
  signup: async ({ fullName, username, email, password }) => axiosInstance.post('/v1/auth/register', { fullName, username, email, password }),

  login: async ({ email, password }) => axiosInstance.post('/v1/auth/login', { email, password }),

  socialSignIn: async (provider, code, redirectUri) => axiosInstance.post('/v1/auth/social-signin', { provider, code, redirectUri }),

  githubSignIn: async () => axiosInstance.get('/v1/auth/github'),

  logout: async (refreshToken) => axiosInstance.post('/v1/auth/logout', { refreshToken }),

  forgotPassword: async ({ email }) => axiosInstance.post('/v1/auth/forgot-password', { email }),

  verifyOTP: async ({ email, code, type = 'forgot_password_verify' }) => axiosInstance.post('/v1/auth/verify-email', { email, code, type }),

  resetPassword: async ({ email, newPassword }) => axiosInstance.post('/v1/auth/reset-password', { email, newPassword }),

  refreshToken: async (refreshToken) => axiosInstance.post('/v1/auth/refresh-token', { refreshToken }),
};

export const UserAPI = {
  getProfile: async () => axiosInstance.get('/v1/users/profile-details'),

  updateProfile: async (userData) => axiosInstance.patch('/v1/users/update-profile', userData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),

  changePassword: async ({ oldPassword, newPassword }) => axiosInstance.post('/v1/users/change-password', { oldPassword, newPassword }),
};

export const DocumentAPI = {
  getDocument: async (documentId) => await axiosInstance.get(`/v1/documents/${documentId}`),

  getAllDocuments: async () => await axiosInstance.get(`/v1/documents/get-my-docs`),

  updateDocument: async (documentId, data) => await axiosInstance.patch(`/v1/documents/${documentId}`, data),

  createDocument: async (data) => await axiosInstance.post(`/v1/documents/create`, data),

  deleteDocument: async (documentId) => await axiosInstance.delete(`/v1/documents/${documentId}/delete`),

  getSharedDocument: async (token) => await axiosInstance.get(`/v1/documents/shared/${token}`)
}

export const CollaboratorAPI = {
  invite: async (documentId, data) => await axiosInstance.post(`/v1/documents/${documentId}/add-collaborators`, data),

  getAllCollaborators: async (documentId) => await axiosInstance.get(`/v1/documents/${documentId}/get-collaborators`),

  removeCollaborator: async (documentId, collaboratorId) => await axiosInstance.delete(`/v1/documents/${documentId}/collaborators/${collaboratorId}`),

  updateCollaboratorRole: async (documentId, collaboratorId, data) => await axiosInstance.patch(`/v1/documents/${documentId}/collaborators/${collaboratorId}`, data),

  updateDocSettings: async (documentId, data) => await axiosInstance.patch(`/v1/documents/${documentId}/settings`, data),

  validateInvitation: async (token) => await axiosInstance.get(`/v1/documents/invite-validate/${token}`),

  acceptInvitation: async (token) => await axiosInstance.post(`/v1/documents/collaborators/accept/${token}`),
}

export const NotificationAPI = {
  getNotifications: async (cursor) =>
    axiosInstance.get('/v1/notifications', { params: cursor ? { cursor } : {} }),

  getUnreadCount: async () => axiosInstance.get('/v1/notifications/unread-count'),

  markRead: async (id) => axiosInstance.patch(`/v1/notifications/${id}/read`),

  markAllRead: async () => axiosInstance.patch('/v1/notifications/mark-all-read'),

  remove: async (id) => axiosInstance.delete(`/v1/notifications/${id}`),
};
