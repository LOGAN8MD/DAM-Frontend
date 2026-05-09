import axios from 'axios';

const API_URL = 'http://localhost:1999/api/assets';

const assetService = {
  // Upload a new asset
  uploadAsset: async (formData, onUploadProgress) => {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Fetch all assets (generic fetch)
  getAssets: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Search/Filter assets
  searchAssets: async (filters = {}) => {
    // Clean up empty filters before sending
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
  },

  // Get download URL helper
  getDownloadUrl: (filename) => {
    return `${API_URL}/download/${filename}`;
  }
};

export default assetService;
