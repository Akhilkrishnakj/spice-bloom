import axios from 'axios';

const api = axios.create({
  baseURL: 'https://spice-bloom.onrender.com/api/v1', // FORCE FIX: Hardcode correct backend URL
  timeout: 10000,
});
console.log("API Base URL axios:", 'https://spice-bloom.onrender.com/api/v1');


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
