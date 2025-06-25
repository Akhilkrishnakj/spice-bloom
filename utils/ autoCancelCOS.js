// utils/autoCancelCOD.js
import Order from '../models/orderModel.js';

export const autoCancelUnpaidCOD = async () => {
  try {
    setInterval(async () => {
      const now = new Date();

      const orders = await Order.find({
        paymentMethod: 'cod',
        'payment.status': 'created',
        'payment.codExpiryTime': { $lte: now }
      });

      for (const order of orders) {
        order.status = 'cancelled';
        order.payment.status = 'cancelled';
        await order.save();
        console.log(`🛑 Cancelled unpaid COD order: ${order._id}`);
      }
    }, 60 * 60 * 1000); // every 1 hour
  } catch (err) {
    console.error("❌ Error in autoCancelUnpaidCOD:", err);
  }
};
