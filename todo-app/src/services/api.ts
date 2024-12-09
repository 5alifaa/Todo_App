import axios from 'axios';
import { getToken } from '../utils/storage';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Attach token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
