import axios from 'axios';

// Helper to get the token from localStorage
const getToken = () => localStorage.getItem('authToken') || localStorage.getItem('token') || '';

// Create an Axios instance (optional, for future config)
const API = axios.create({
  baseURL: '/api/v1',
});

// GET all addresses
export const fetchAddresses = () =>
  API.get('/address', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// POST new address
export const createAddress = (data) =>
  API.post('/address', data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// DELETE address
export const deleteAddress = (id) =>
  API.delete(`/address/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
