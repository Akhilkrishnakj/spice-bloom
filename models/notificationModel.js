import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null means it's a system-wide notification
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['order', 'system', 'delivery', 'offer'],
    default: 'system',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Notification', notificationSchema);
