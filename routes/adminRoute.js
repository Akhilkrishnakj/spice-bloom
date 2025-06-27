import express from 'express';
import { getAdminDashboardData, getAllUsers } from '../controllers/adminController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { 
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatus,
  deleteOrderAdmin, 
  getRecentOrders,
  getTrackingStats,
  getDeliveryRoute,
  startTracking,
  getAllReturnRequests,
  approveReturn,
  rejectReturn,
  processRefund,
  markItemReturned
} from '../controllers/adminOrderController.js';
import User from '../models/userModel.js';
const router = express.Router();

// Route → GET /api/v1/admin/dashboard
router.get('/dashboard', getAdminDashboardData);

// 📦 Order Management Routes
router.get("/orders", requireSignIn, isAdmin, getAllOrdersAdmin);
router.get("/orders/:id", requireSignIn, isAdmin, getOrderByIdAdmin);
router.put("/orders/:id", requireSignIn, isAdmin, updateOrderStatus);
router.delete("/orders/:id", requireSignIn, isAdmin, deleteOrderAdmin);
router.get("/orders/recent", requireSignIn, isAdmin, getRecentOrders);

// 🚚 Tracking Routes
router.get("/tracking/stats", requireSignIn, isAdmin, getTrackingStats);
router.get("/tracking/route/:orderId", requireSignIn, isAdmin, getDeliveryRoute);
router.post("/tracking/start/:orderId", requireSignIn, isAdmin, startTracking);

// 🔄 Return & Refund Management Routes
router.get("/returns", requireSignIn, isAdmin, getAllReturnRequests);
router.post("/returns/approve", requireSignIn, isAdmin, approveReturn);
router.post("/returns/reject", requireSignIn, isAdmin, rejectReturn);
router.post("/returns/process-refund", requireSignIn, isAdmin, processRefund);
router.post("/returns/mark-returned", requireSignIn, isAdmin, markItemReturned);

// 👥 User Management Routes
router.get("/",  requireSignIn, isAdmin, getAllUsers);

// Block/unblock user
router.patch('/users/:id/block', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(id, { blocked }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update block status' });
  }
});

// Promote user to admin
router.patch('/users/:id/promote', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: 1 }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to promote user' });
  }
});

export default router;
