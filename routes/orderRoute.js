import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { createOrderController, getAllOrders, getOrderById, updateOrderStatus, returnProductController, requestReturn, getUserReturns } from '../controllers/orderController.js';
import Order from '../models/orderModel.js';
import { getRecentOrders } from '../controllers/adminOrderController.js';

const router = express.Router();

router.get('/orders', isAdmin, getAllOrders);
router.get('/order/:id', isAdmin, getOrderById);
router.put('/order/:id/status', isAdmin, updateOrderStatus);
router.post('/create', requireSignIn, createOrderController);

// ✅ Fixed my-orders route
router.get("/my-orders", requireSignIn, async (req, res) => {
  try {
    const orders = await Order
      .find({ buyer: req.user._id })
      .populate("items.productId") // ✅ Changed from "products.product" to "items.productId"
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
});

router.put('/return/:orderId/:productId', requireSignIn, returnProductController);

// GET /api/orders/recent
router.get('/recent',  getRecentOrders)

// 🔄 Return & Refund Routes
router.post("/return/request", requireSignIn, requestReturn);
router.get("/returns", requireSignIn, getUserReturns);

export default router;
