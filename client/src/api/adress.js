import api from './axios.js';

// GET all addresses
export const fetchAddresses = () => api.get('/address');

// POST new address
export const createAddress = (data) => api.post('/address', data);

// DELETE address
export const deleteAddress = (id) => api.delete(`/address/${id}`);

// PUT update address
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);
