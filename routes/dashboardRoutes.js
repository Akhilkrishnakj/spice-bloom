import express from 'express';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

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

// GET /api/v1/dashboard/sales-trend
router.get('/sales-trend', async (req, res) => {
  try {
    const period = req.query.period || 'week';
    const dateParam = req.query.date;
    let start, end = new Date();
    end.setHours(0, 0, 0, 0);

    let groupFormat, numPoints, labelFn;

    if (period === 'day' && dateParam) {
      // Single day mode
      const day = new Date(dateParam);
      day.setHours(0, 0, 0, 0);
      start = new Date(day);
      end = new Date(day);
      groupFormat = "%Y-%m-%d";
      numPoints = 1;
      labelFn = () => day.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (period === 'year') {
      start = new Date(end.getFullYear(), 0, 1);
      groupFormat = "%Y-%m";
      numPoints = 12;
      labelFn = (i) => {
        const d = new Date(end.getFullYear(), i, 1);
        return d.toLocaleDateString('en-US', { month: 'short' });
      };
    } else if (period === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
      groupFormat = "%Y-%m-%d";
      numPoints = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
      labelFn = (i) => (i + 1).toString();
    } else {
      start = new Date(end);
      start.setDate(end.getDate() - 6);
      groupFormat = "%Y-%m-%d";
      numPoints = 7;
      labelFn = (i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      };
    }

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          sales: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill missing points with 0 sales and label
    const result = [];
    for (let i = 0; i < numPoints; i++) {
      let key, label;
      if (period === 'year') {
        const month = (i + 1).toString().padStart(2, '0');
        key = `${end.getFullYear()}-${month}`;
        label = labelFn(i);
      } else if (period === 'month') {
        const day = (i + 1).toString().padStart(2, '0');
        key = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${day}`;
        label = labelFn(i);
      } else if (period === 'day' && dateParam) {
        key = dateParam;
        label = labelFn();
      } else {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        key = d.toISOString().slice(0, 10);
        label = labelFn(i);
      }
      const found = sales.find(s => s._id === key);
      result.push({ date: label, sales: found ? found.sales : 0 });
    }

    res.json(result);
  } catch (err) {
    console.error('Sales Trend Error:', err);
    res.status(500).json({ error: "Failed to load sales trend" });
  }
});

// GET /api/v1/dashboard/new-users-trend
router.get('/new-users-trend', async (req, res) => {
  try {
    const period = req.query.period || 'week';
    const dateParam = req.query.date;
    let start, end = new Date();
    end.setHours(0, 0, 0, 0);

    let groupFormat, numPoints, labelFn;

    if (period === 'day' && dateParam) {
      // Single day mode
      const day = new Date(dateParam);
      day.setHours(0, 0, 0, 0);
      start = new Date(day);
      end = new Date(day);
      groupFormat = "%Y-%m-%d";
      numPoints = 1;
      labelFn = () => day.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (period === 'year') {
      start = new Date(end.getFullYear(), 0, 1);
      groupFormat = "%Y-%m";
      numPoints = 12;
      labelFn = (i) => {
        const d = new Date(end.getFullYear(), i, 1);
        return d.toLocaleDateString('en-US', { month: 'short' });
      };
    } else if (period === 'month') {
      start = new Date(end.getFullYear(), end.getMonth(), 1);
      groupFormat = "%Y-%m-%d";
      numPoints = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
      labelFn = (i) => (i + 1).toString();
    } else {
      start = new Date(end);
      start.setDate(end.getDate() - 6);
      groupFormat = "%Y-%m-%d";
      numPoints = 7;
      labelFn = (i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d.toLocaleDateString('en-US', { weekday: 'short' });
      };
    }

    const users = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill missing points with 0 count and label
    const result = [];
    for (let i = 0; i < numPoints; i++) {
      let key, label;
      if (period === 'year') {
        const month = (i + 1).toString().padStart(2, '0');
        key = `${end.getFullYear()}-${month}`;
        label = labelFn(i);
      } else if (period === 'month') {
        const day = (i + 1).toString().padStart(2, '0');
        key = `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${day}`;
        label = labelFn(i);
      } else if (period === 'day' && dateParam) {
        key = dateParam;
        label = labelFn();
      } else {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        key = d.toISOString().slice(0, 10);
        label = labelFn(i);
      }
      const found = users.find(u => u._id === key);
      result.push({ date: label, count: found ? found.count : 0 });
    }

    res.json(result);
  } catch (err) {
    console.error('New Users Trend Error:', err);
    res.status(500).json({ error: "Failed to load new users trend" });
  }
});

export default router;

