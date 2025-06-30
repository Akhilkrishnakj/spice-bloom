import axios from "axios";

const OFFER_API_URL = "/api/v1/offer";
const COUPON_API_URL = "/api/v1/coupon";

// Offer endpoints
export const getOffers = async () => axios.get(OFFER_API_URL);
export const createOffer = async (data) => axios.post(OFFER_API_URL, data);
export const updateOffer = async (id, data) => axios.put(`${OFFER_API_URL}/${id}`, data);
export const deleteOffer = async (id) => axios.delete(`${OFFER_API_URL}/${id}`);

// Coupon endpoints
export const getCoupons = async () => axios.get(COUPON_API_URL);
export const createCoupon = async (data) => axios.post(COUPON_API_URL, data);
export const updateCoupon = async (id, data) => axios.put(`${COUPON_API_URL}/${id}`, data);
export const deleteCoupon = async (id) => axios.delete(`${COUPON_API_URL}/${id}`);
