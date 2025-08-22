import axios from 'axios';

const axiosClient = axios.create({
  // Use base URL from environment variable (defined in .env)
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosClient;
