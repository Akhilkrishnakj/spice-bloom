import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
});

// ✅ Log base URL only in development
if (process.env.NODE_ENV === 'development') {
  console.log("🔧 API Base URL:", BACKEND_URL);
  console.log("🔧 Axios defaults:", api.defaults);
}

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = 'application/json';

    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      delete config.headers['Content-Type'];
    }

    if (process.env.NODE_ENV === 'development') {
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log("🚀 Request to:", fullUrl);
      console.log("🔧 Method:", (config.method || '').toUpperCase());
      console.log("🔧 Headers:", config.headers);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log("✅ Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }

    console.error("❌ API error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
