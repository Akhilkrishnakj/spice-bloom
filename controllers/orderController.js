import orderModel from "../models/orderModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("products.product")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
      .populate("products.product")
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
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { cart, address, payment } = req.body;

    if (!cart?.length || !address || !payment) {
      return res.status(400).json({ success: false, message: "Cart, address or payment details missing" });
    }

    const products = cart.map(item => ({
      product: item._id,
      quantity: item.quantity,
    }));

    const order = await orderModel.create({
      products,
      buyer: req.user._id,
      address,
      payment: {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        status: "success", // or set dynamically
        amount: payment.amount,
        currency: "INR",
      }
    });

    res.status(201).json({ success: true, order });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};
