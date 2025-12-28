import axiosInstance from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async register(userData) {
    return await axiosInstance.post(`${API_BASE_URL}/api/auth/register`, userData);
  }

  async getDocument(documentId) {
    return await axiosInstance.get(`${API_BASE_URL}/documents/${documentId}`);
  }

  async getAllDocuments() {
    return await axiosInstance.get(`${API_BASE_URL}/documents/get-my-docs`);
  }

  async updateDocument(documentId, data) {
    return await axiosInstance.put(`${API_BASE_URL}/documents/${documentId}`, data);
  }

  async createDocument(data) {
    return await axiosInstance.post(`${API_BASE_URL}/documents/create`, data);
  }

  async deleteDocument(documentId) {
    return await axiosInstance.delete(`${API_BASE_URL}/documents/${documentId}`);
  }

  async addCollaborator(documentId, email) {
    return await axiosInstance.post(`${API_BASE_URL}/documents/${documentId}/share`, { email });
  }

  async removeCollaborator(documentId, userId) {
    return await axiosInstance.delete(`${API_BASE_URL}/documents/${documentId}/share/${userId}`);
  }
}

export default new ApiService();