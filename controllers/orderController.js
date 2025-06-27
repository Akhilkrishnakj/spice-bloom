import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { io } from "../server.js";
import Razorpay from "razorpay";

export const getAllOrders = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate("items.productId")
        .populate("buyer", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments()
    ]);
    res.json({ success: true, orders, total, page, limit });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("buyer", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.productId").populate("buyer", "name email"); // include buyer if needed

    // ✅ Emit to client
    io.emit("order-status-update", order);

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};
export const createOrderController = async (req, res) => {
  console.log("🟠 Backend Received Body:", req.body);

  try {
    const {
      items, // ✅ Match what frontend sends
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      payment,
      paymentMethod,
    } = req.body;

    // ✅ Validation
    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No products to order" });
    }

    const buyerId = req.user._id;

    // ✅ Generate Order Number
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
    const orderNumber = `SPB-${day}${month}-${year}-${random}`;

    // --- WALLET DEDUCTION LOGIC ---
    if (paymentMethod === 'wallet') {
      // Find user and check wallet balance
      const user = await User.findById(buyerId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      if (user.wallet < total) {
        return res.status(400).json({ error: 'Insufficient wallet balance.' });
      }
      
      // Deduct amount from user's wallet
      user.wallet -= total;
      
      // Add transaction record
      user.transactions.push({
        type: 'purchase',
        amount: total,
        description: `Order ${orderNumber}`,
        orderId: orderNumber,
        balanceAfter: user.wallet,
        date: new Date()
      });
      
      await user.save();
    }
    // --- END WALLET LOGIC ---

    // ✅ Create new order using items directly (they're already in the right format)
    const newOrder = new Order({
      orderNumber,
      buyer: buyerId,
      items, // ✅ Use items directly from frontend
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      payment: {
        ...payment,
        status: payment?.status || (paymentMethod === "cod" ? "paid" : "created"),
      },
      status: "processing",
    });

    // ✅ Set expiry if COD
    if (paymentMethod === "cod") {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      newOrder.payment.codExpiryTime = expiry;
    }

    console.log("🧠 Saving Order:", newOrder);

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

export const returnProductController = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ error: "Only delivered orders can be returned" });
    }

    // Check delivery date
    const deliveryDate = new Date(order.deliveredDate);
    const now = new Date();
    const diffInDays = Math.floor((now - deliveryDate) / (1000 * 60 * 60 * 24));

    if (diffInDays > 7) {
      return res.status(400).json({ error: "Return period expired (7 days only)" });
    }

    const productItem = order.items.find(item => item.productId.toString() === productId);

    if (!productItem) {
      return res.status(404).json({ error: "Product not found in order" });
    }

    if (productItem.returnRequest?.status !== "none") {
      return res.status(400).json({ error: "Return already requested for this product" });
    }

    productItem.returnRequest = {
      status: "requested",
      requestedAt: now,
      reason,
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully, we will approve within 24 hours",
      product: productItem,
    });
  } catch (err) {
    console.error("Return product error:", err);
    res.status(500).json({ error: "Failed to request return" });
  }
};

// 🔄 Request Return for delivered order
export const requestReturn = async (req, res) => {
  try {
    const { orderId, itemIndex, reason, description, photos } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.buyer._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Order must be delivered to request return' });
    }

    // Check if return window is still open (7 days)
    const returnWindowExpires = order.delivery.returnWindowExpires;
    if (returnWindowExpires && new Date() > returnWindowExpires) {
      return res.status(400).json({ success: false, message: 'Return window has expired' });
    }

    // Check if item exists and hasn't been returned
    if (!order.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' });
    }

    const item = order.items[itemIndex];
    if (item.returnRequest.status !== 'none') {
      return res.status(400).json({ success: false, message: 'Return already requested for this item' });
    }

    // Update item return request
    item.returnRequest = {
      status: 'requested',
      requestedAt: new Date(),
      reason,
      description,
      photos: photos || [],
    };

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${userId}`).emit('return-request-update', {
        orderId,
        itemIndex,
        returnRequest: item.returnRequest
      });
    }

    res.json({
      success: true,
      message: 'Return request submitted successfully',
      returnRequest: item.returnRequest
    });

  } catch (error) {
    console.error('Error requesting return:', error);
    res.status(500).json({ success: false, message: 'Failed to request return' });
  }
};

// 📋 Get user's return requests
export const getUserReturns = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({
      buyer: userId,
      status: 'delivered',
      'items.returnRequest.status': { $ne: 'none' }
    }).populate('buyer');

    const returns = [];
    orders.forEach(order => {
      order.items.forEach((item, index) => {
        if (item.returnRequest.status !== 'none') {
          returns.push({
            orderId: order._id,
            orderNumber: order.orderNumber,
            itemIndex: index,
            item,
            returnRequest: item.returnRequest,
            returnWindowExpires: order.delivery.returnWindowExpires
          });
        }
      });
    });

    res.json({ success: true, returns });

  } catch (error) {
    console.error('Error fetching user returns:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch returns' });
  }
};

// 🚫 User: Cancel order with wallet refund
export const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.buyer._id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'processing', 'shipped', 'out_for_delivery'];
    if (!cancellableStatuses.includes(order.status.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: `Order cannot be cancelled in ${order.status} status` 
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = userId;
    order.cancellationReason = reason || 'Cancelled by user';

    // Add to status timeline
    if (!order.statusTimeline) {
      order.statusTimeline = [];
    }
    order.statusTimeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      notes: `Order cancelled by user: ${reason || 'No reason provided'}`,
      updatedBy: userId
    });

    // Process refund based on payment method
    let refundTransactionId = null;
    let refundAmount = order.total;

    if (order.paymentMethod === 'wallet') {
      // Add to user's wallet
      const user = await User.findById(userId);
      user.wallet += refundAmount;
      user.transactions.push({
        type: 'refund',
        amount: refundAmount,
        description: `Order cancellation refund for ${order.orderNumber}`,
        orderId: order.orderNumber,
        balanceAfter: user.wallet,
        date: new Date()
      });
      await user.save();
      refundTransactionId = `wallet_refund_${Date.now()}`;
    } else if (order.paymentMethod === 'razorpay' && order.payment?.razorpay_payment_id) {
      // Process Razorpay refund
      try {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const refund = await razorpay.payments.refund(order.payment.razorpay_payment_id, {
          amount: refundAmount * 100, // Razorpay expects amount in paise
          speed: 'normal'
        });

        refundTransactionId = refund.id;
      } catch (razorpayError) {
        console.error('Razorpay refund error:', razorpayError);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to process payment refund. Please contact support.' 
        });
      }
    }

    // Update order with refund info
    order.returnInfo = {
      ...order.returnInfo,
      totalRefundAmount: refundAmount,
      refundStatus: 'Completed',
      refundMethod: order.paymentMethod === 'wallet' ? 'Wallet' : 'Original Payment',
      refundTransactionId: refundTransactionId,
      refundProcessedAt: new Date(),
      refundProcessedBy: userId
    };

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${userId}`).emit('order-status-update', order);
      global.io.to('admin-room').emit('order-status-update', order);
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
      refundAmount,
      refundTransactionId
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

export default {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrderController,
  returnProductController,
  requestReturn,
  getUserReturns,
  cancelOrder
};

