import express from 'express';
import { requireAdmin } from '../middlewares/authMiddleware.js';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.get('/orders', requireAdmin, getAllOrders);
router.get('/order/:id', requireAdmin, getOrderById);
router.put('/order/:id/status', requireAdmin, updateOrderStatus);

export default router;
