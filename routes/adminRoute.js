import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { getAdminDashboardData } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard',  getAdminDashboardData);

export default router;
