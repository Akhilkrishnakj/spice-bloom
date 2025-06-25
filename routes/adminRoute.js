import express from 'express';
import { getAdminDashboardData, getAllUsers } from '../controllers/adminController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {  getAllOrdersAdmin,getOrderByIdAdmin,updateOrderStatus,deleteOrderAdmin, getRecentOrders } from '../controllers/adminOrderController.js';
const router = express.Router();

// Route → GET /api/v1/admin/dashboard
router.get('/dashboard', getAdminDashboardData);
router.get("/orders", requireSignIn, isAdmin, getAllOrdersAdmin);
router.get("/orders/:id", requireSignIn, isAdmin, getOrderByIdAdmin);
router.put("/orders/:id", requireSignIn, isAdmin, updateOrderStatus);
router.delete("/orders/:id", requireSignIn, isAdmin, deleteOrderAdmin);
router.get("/orders/recent", requireSignIn, isAdmin, getRecentOrders);
router.get("/",  requireSignIn, isAdmin, getAllUsers);

;


export default router;
