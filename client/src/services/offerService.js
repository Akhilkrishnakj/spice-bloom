import axios from "axios";

const API_URL = "/api/v1/offer";  

export const getOffers = async () => {
  return await axios.get(API_URL);
};

export const createOffer = async (data) => {
  return await axios.post(API_URL, data);
};

export const deleteOffer = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateOffer = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};
