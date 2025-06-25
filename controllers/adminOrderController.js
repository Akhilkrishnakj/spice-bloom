import Order from "../models/orderModel.js";

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

// ✅ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    res.json({ success: true, message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// ✅ (Optional) Delete an order
export const deleteOrderAdmin = async (req, res) => {
  try {
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
