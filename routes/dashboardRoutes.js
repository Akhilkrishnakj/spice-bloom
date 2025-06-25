import express from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json([
      {
        title: "Total Orders",
        value: orderCount,
        description: "All customer orders",
        iconColor: "text-blue-600",
        lightColor: "bg-blue-50"
      },
      {
        title: "Total Products",
        value: productCount,
        description: "Products in store",
        iconColor: "text-purple-600",
        lightColor: "bg-purple-50"
      },
      {
        title: "Users",
        value: userCount,
        description: "Registered users",
        iconColor: "text-green-600",
        lightColor: "bg-green-50"
      },
      {
        title: "Total Revenue",
        value: `₹${totalRevenue[0]?.total || 0}`,
        description: "Earned through sales",
        iconColor: "text-yellow-600",
        lightColor: "bg-yellow-50"
      },
    ]);
  } catch (err) {
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

// GET /api/dashboard/sidebar
router.get('/sidebar', async (req, res) => {
  try {
    const dashboard = await Order.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const users = await User.countDocuments();
    const offers = 0; // update if you have

    res.json({ dashboard, products, orders, users, offers });
  } catch (err) {
    res.status(500).json({ error: "Failed to load sidebar data" });
  }
});

export default router;

