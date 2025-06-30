import express from 'express';
import Notification from '../models/notificationModel.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/notifications
router.get('/', requireSignIn, async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [
        { user: null }, // system/global notifications
        { user: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

export default router;
