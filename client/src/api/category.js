// /src/api/category.js
import axios from 'axios';

const API = "/api/v1/category";

export const createCategory = (data) => axios.post(`${API}/create`, data);
export const getAllCategories = () => axios.get(`${API}/get-category`);
export const deleteCategory = (id) => axios.delete(`${API}/delete/${id}`);
export const updateCategory = (id, data) => axios.put(`${API}/update/${id}`, data);
