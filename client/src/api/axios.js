import axios from 'axios';

const BACKEND_URL = 'https://spice-bloom.onrender.com/api/v1';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

console.log("🔧 API Base URL:", BACKEND_URL);
console.log("🔧 Full axios config:", api.defaults);

api.interceptors.request.use(
  (config) => {
    console.log("🚀 Making request to:", config.baseURL + config.url);
    console.log("🔧 Request method:", config.method?.toUpperCase());
    console.log("🔧 Request headers:", config.headers);
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
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.response?.data, error.config?.url);
    return Promise.reject(error);
  }
);
export default api