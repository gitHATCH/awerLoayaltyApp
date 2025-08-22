import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com', // TODO: set real API base URL
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
