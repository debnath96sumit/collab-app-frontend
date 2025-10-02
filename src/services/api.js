import axiosInstance from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async getDocument(documentId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
    if (!response.ok) throw new Error('Failed to fetch document');
    return response.json();
  }

  async getAllDocuments() {
    return await axiosInstance.get(`${API_BASE_URL}/documents`);
  }

  async updateDocument(documentId, data) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update document');
    return response.json();
  }

  async createDocument(data) {
    return await axiosInstance.post(`${API_BASE_URL}/documents`, data);
  }
}

export default new ApiService();