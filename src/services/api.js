const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  async getDocument(documentId) {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
    if (!response.ok) throw new Error('Failed to fetch document');
    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create document');
    return response.json();
  }
}

export default new ApiService();