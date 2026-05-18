import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
});

// Attach token + correct Content-Type on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set JSON content-type if NOT sending FormData
  // FormData needs the browser to auto-set Content-Type with the boundary
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// Handle 401 globally — only redirect for token-related errors, not validation errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || '';

      // Only redirect to login for token-related 401s
      // Don't redirect for "wrong password" or similar validation 401s
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
