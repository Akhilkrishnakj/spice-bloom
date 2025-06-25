import api from './axios.js';

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/v1/user/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/api/v1/user/update-profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await api.get('/api/v1/user/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user profile (basic info)
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/v1/user/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
}; 