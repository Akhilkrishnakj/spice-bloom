// /src/api/category.js
import api from './axios.js';

export const createCategory = (data) => api.post('/category/create', data);
export const getAllCategories = () => api.get('/category/get-category');
export const deleteCategory = (id) => api.delete(`/category/delete/${id}`);
export const updateCategory = (id, data) => api.put(`/category/update/${id}`, data);
