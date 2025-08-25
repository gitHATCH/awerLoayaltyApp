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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const params = new URLSearchParams({ refresh_token: refreshToken });
          const { data } = await axios.post(
            `${axiosClient.defaults.baseURL}/awer-auth/oauth/token?grant_type=refresh_token`,
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          );
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
          }
          return axiosClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
