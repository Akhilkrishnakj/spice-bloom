import Order from "../models/orderModel.js";

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
    );
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
      status: "Processing",
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

    if (order.status !== "Delivered") {
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

    if (productItem.returnRequest?.status !== "None") {
      return res.status(400).json({ error: "Return already requested for this product" });
    }

    productItem.returnRequest = {
      status: "Requested",
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

