// routes/userRoutes.js
import express from 'express';
import { getMe, updateProfile, getUserStats } from '../controllers/userController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import User from '../models/userModel.js';
const router = express.Router();

router.get('/me', requireSignIn, getMe);
router.put('/update-profile', requireSignIn, updateProfile);
router.get('/stats', requireSignIn, getUserStats);

router.get('/profile', requireSignIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      initials: user.name?.charAt(0).toUpperCase()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile" });
  }
});

export default router;
