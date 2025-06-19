import express from 'express';
import { isAdmin,requireSignIn } from '../middlewares/authMiddleware.js';
import { createOrder,getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.get('/orders', isAdmin, getAllOrders);
router.get('/order/:id', isAdmin, getOrderById);
router.put('/order/:id/status', isAdmin, updateOrderStatus);
router.post('/create', requireSignIn, createOrder);

export default router;
