import axios from 'axios';

const axiosClient = axios.create({
  // Use base URL from environment variable (defined in .env)
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Only attach bearer token if no Authorization header is already provided
  if (token && config.headers && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url ?? '';
    if (error.response?.status === 401 && !requestUrl.includes('/awer-auth/oauth/token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('brand');
      localStorage.removeItem('companyId');
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
