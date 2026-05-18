import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  timeout: 15000,
});

// Attach token on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // For FormData, delete Content-Type so browser auto-sets it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// Handle 401 globally — only redirect for token-related errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    // Log for debugging
    console.error('API Error:', error.response?.status, error.response?.data?.message || error.message);

    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';

      // Only redirect to login for actual token problems
      const tokenErrors = ['Token is missing', 'Token is invalid', 'Something went wrong while validating the token'];
      const isTokenError = tokenErrors.some((e) => msg.includes(e));

      if (isTokenError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
