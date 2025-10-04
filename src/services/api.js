import axiosInstance from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async getDocument(documentId) {
    return await axiosInstance.get(`${API_BASE_URL}/documents/${documentId}`);
  }

  async getAllDocuments() {
    return await axiosInstance.get(`${API_BASE_URL}/documents`);
  }

  async updateDocument(documentId, data) {
    return await axiosInstance.put(`${API_BASE_URL}/documents/${documentId}`, data);
  }

  async createDocument(data) {
    return await axiosInstance.post(`${API_BASE_URL}/documents`, data);
  }

  async deleteDocument(documentId){
    return await axiosInstance.delete(`${API_BASE_URL}/documents/${documentId}`);
  }
}

export default new ApiService();