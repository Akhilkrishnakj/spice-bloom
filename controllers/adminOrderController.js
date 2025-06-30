import Order from "../models/orderModel.js";
import { io } from "../server.js";
import trackingService from "../utils/trackingService.js";
import Razorpay from "razorpay";
import User from "../models/userModel.js";

// ✅ Get all orders (with pagination)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      pages: Math.ceil(total / limit),
      total,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ Get single order
export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("buyer", "name email");
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Failed to get order" });
  }
};

// 🚚 Enhanced order status update with tracking
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, notes, deliveryInfo } = req.body;
    const adminId = req.user._id;
    const orderId = req.params.id;

    let updatedOrder;

    try {
      // Try to use tracking service first
      updatedOrder = await trackingService.updateOrderStatus(
        orderId, 
        status, 
        adminId, 
        notes
      );
    } catch (trackingError) {
      console.error('Tracking service error, falling back to direct update:', trackingError);
      
      // Fallback: direct order update
      updatedOrder = await Order.findById(orderId);
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const oldStatus = updatedOrder.status;
      updatedOrder.status = status;

      // Add to status timeline
      if (!updatedOrder.statusTimeline) {
        updatedOrder.statusTimeline = [];
      }
      
      updatedOrder.statusTimeline.push({
        status: status,
        timestamp: new Date(),
        notes: notes || `Status updated from ${oldStatus} to ${status}`,
        updatedBy: adminId
      });

      // Handle specific status updates
      if (status === 'delivered') {
        updatedOrder.delivery = {
          ...updatedOrder.delivery,
          deliveredDate: new Date(),
          returnWindowExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
      } else if (status === 'cancelled') {
        updatedOrder.cancelledAt = new Date();
        updatedOrder.cancelledBy = adminId;
      }

      await updatedOrder.save();
    }

    // Handle delivery-specific information
    if (status === 'delivered' && deliveryInfo) {
      updatedOrder.delivery = {
        ...updatedOrder.delivery,
        deliveredBy: deliveryInfo.deliveredBy || 'Delivery Partner',
        deliveryTime: new Date().toLocaleTimeString(),
        signature: deliveryInfo.signature || 'Digital Signature',
        deliveryNotes: deliveryInfo.notes || 'Successfully delivered',
        recipientName: deliveryInfo.recipientName || updatedOrder.shippingAddress.name,
        recipientPhone: deliveryInfo.recipientPhone || ''
      };
      await updatedOrder.save();
    }

    // Populate buyer information for socket emission
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("buyer", "name email");

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.emit('order-status-update', populatedOrder);
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      updatedOrder: populatedOrder,
    });
  } catch (err) {
    console.error('❌ Error updating order status:', err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update order status",
      error: err.message 
    });
  }
};

// 📊 Get tracking statistics
export const getTrackingStats = async (req, res) => {
  try {
    const stats = await trackingService.getTrackingStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: "Failed to get tracking stats" });
  }
};

// 🗺️ Get delivery route for an order
export const getDeliveryRoute = async (req, res) => {
  try {
    const route = trackingService.getDeliveryRoute(req.params.orderId);
    res.json({ success: true, route });
  } catch (err) {
    res.status(500).json({ error: "Failed to get delivery route" });
  }
};

// 🚀 Start tracking for an order
export const startTracking = async (req, res) => {
  try {
    await trackingService.startTracking(req.params.orderId);
    res.json({ success: true, message: "Tracking started successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to start tracking" });
  }
};

// ✅ (Optional) Delete an order
export const deleteOrderAdmin = async (req, res) => {
  try {
    // Stop tracking before deleting
    trackingService.stopTracking(req.params.id);
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// controller
export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("buyer", "name email"); // Assuming 'buyer' is the customer field

    const formatted = orders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      tracking: o.tracking,
      customer: {
        name: o.buyer?.name || "Unknown",
        email: o.buyer?.email || "",
        initials: o.buyer?.name?.charAt(0) || "U",
      },
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};

// 🔄 Admin: Get all return requests
export const getAllReturnRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      'items.returnRequest.status': { $in: ['requested', 'approved', 'returned'] }
    }).populate('buyer', 'name email');

    const returnRequests = [];
    orders.forEach(order => {
      order.items.forEach((item, index) => {
        if (['requested', 'approved', 'returned'].includes(item.returnRequest.status)) {
          returnRequests.push({
            orderId: order._id,
            orderNumber: order.orderNumber,
            itemIndex: index,
            item,
            returnRequest: item.returnRequest,
            buyer: order.buyer,
            returnWindowExpires: order.delivery.returnWindowExpires,
            orderTotal: order.total
          });
        }
      });
    });

    res.json({ success: true, returnRequests });

  } catch (error) {
    console.error('Error fetching return requests:', error);
    res.status(500).json({ error: "Failed to fetch return requests" });
  }
};

// ✅ Admin: Approve return request
export const approveReturn = async (req, res) => {
  try {
    const { orderId, itemIndex, returnShippingLabel, notes } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' });
    }

    const item = order.items[itemIndex];
    if (item.returnRequest.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'Return request not in requested status' });
    }

    // Update return request status
    item.returnRequest.status = 'approved';
    item.returnRequest.approvedAt = new Date();
    item.returnRequest.approvedBy = adminId;
    item.returnRequest.returnShippingLabel = returnShippingLabel;
    item.returnRequest.description = notes || item.returnRequest.description;

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${order.buyer._id}`).emit('return-request-update', {
        orderId,
        itemIndex,
        returnRequest: item.returnRequest
      });
    }

    res.json({
      success: true,
      message: 'Return request approved',
      returnRequest: item.returnRequest
    });

  } catch (error) {
    console.error('Error approving return:', error);
    res.status(500).json({ success: false, message: 'Failed to approve return' });
  }
};

// ❌ Admin: Reject return request
export const rejectReturn = async (req, res) => {
  try {
    const { orderId, itemIndex, rejectionReason } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' });
    }

    const item = order.items[itemIndex];
    if (item.returnRequest.status !== 'requested') {
      return res.status(400).json({ success: false, message: 'Return request not in requested status' });
    }

    // Update return request status
    item.returnRequest.status = 'rejected';
    item.returnRequest.rejectedAt = new Date();
    item.returnRequest.rejectedBy = adminId;
    item.returnRequest.rejectionReason = rejectionReason;

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${order.buyer._id}`).emit('return-request-update', {
        orderId,
        itemIndex,
        returnRequest: item.returnRequest
      });
    }

    res.json({
      success: true,
      message: 'Return request rejected',
      returnRequest: item.returnRequest
    });

  } catch (error) {
    console.error('Error rejecting return:', error);
    res.status(500).json({ success: false, message: 'Failed to reject return' });
  }
};

// 💰 Admin: Process refund for returned item
export const processRefund = async (req, res) => {
  try {
    const { orderId, itemIndex, refundMethod } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' });
    }

    const item = order.items[itemIndex];
    if (item.returnRequest.status !== 'returned') {
      return res.status(400).json({ success: false, message: 'Item must be returned before processing refund' });
    }

    const refundAmount = item.price * item.quantity;

    // Process refund based on payment method
    let refundTransactionId = null;
    
    if (order.paymentMethod === 'razorpay' && order.payment.razorpay_payment_id) {
      // Process Razorpay refund
      try {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET,
        });

        const refund = await razorpay.payments.refund(order.payment.razorpay_payment_id, {
          amount: refundAmount * 100, // Razorpay expects amount in paise
          speed: 'normal'
        });

        refundTransactionId = refund.id;
      } catch (razorpayError) {
        console.error('Razorpay refund error:', razorpayError);
        return res.status(500).json({ success: false, message: 'Failed to process payment refund' });
      }
    } else if (order.paymentMethod === 'wallet') {
      // Add to user's wallet
      const user = await User.findById(order.buyer._id);
      user.wallet.balance += refundAmount;
      user.wallet.transactions.push({
        type: 'credit',
        amount: refundAmount,
        description: `Refund for ${order.orderNumber} - ${item.name}`,
        timestamp: new Date()
      });
      await user.save();
      refundTransactionId = `wallet_${Date.now()}`;
    }

    // Update item return request
    item.returnRequest.status = 'refunded';
    item.returnRequest.refundedAt = new Date();
    item.returnRequest.refundAmount = refundAmount;

    // Update order return info
    order.returnInfo.totalReturnedItems += 1;
    order.returnInfo.totalRefundAmount += refundAmount;
    order.returnInfo.refundStatus = 'Completed';
    order.returnInfo.refundMethod = refundMethod || 'Original Payment';
    order.returnInfo.refundTransactionId = refundTransactionId;
    order.returnInfo.refundProcessedAt = new Date();
    order.returnInfo.refundProcessedBy = adminId;

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${order.buyer._id}`).emit('refund-processed', {
        orderId,
        itemIndex,
        refundAmount,
        refundTransactionId
      });
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refundAmount,
      refundTransactionId
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ success: false, message: 'Failed to process refund' });
  }
};

// 📦 Admin: Mark item as returned
export const markItemReturned = async (req, res) => {
  try {
    const { orderId, itemIndex, returnTrackingNumber } = req.body;
    const adminId = req.user._id;

    const order = await Order.findById(orderId).populate('buyer');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.items[itemIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid item index' });
    }

    const item = order.items[itemIndex];
    if (item.returnRequest.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Return request must be approved first' });
    }

    // Update return request status
    item.returnRequest.status = 'returned';
    item.returnRequest.returnedAt = new Date();
    item.returnRequest.returnTrackingNumber = returnTrackingNumber;

    await order.save();

    // Emit socket event for real-time updates
    if (global.io) {
      global.io.to(`user_${order.buyer._id}`).emit('return-request-update', {
        orderId,
        itemIndex,
        returnRequest: item.returnRequest
      });
    }

    res.json({
      success: true,
      message: 'Item marked as returned',
      returnRequest: item.returnRequest
    });

  } catch (error) {
    console.error('Error marking item returned:', error);
    res.status(500).json({ success: false, message: 'Failed to mark item as returned' });
  }
};
