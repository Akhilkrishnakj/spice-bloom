import express from 'express';
import { getMe, updateProfile, getUserStats } from '../controllers/userController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get current logged-in user
router.get('/me', requireSignIn, getMe);

// Update profile
router.put('/update-profile', requireSignIn, updateProfile);

// User stats
router.get('/stats', requireSignIn, getUserStats);



export default router;
