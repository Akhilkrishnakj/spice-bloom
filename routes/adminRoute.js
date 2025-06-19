import express from 'express';
import { getAdminDashboardData } from '../controllers/adminController.js';

const router = express.Router();

// Route → GET /api/v1/admin/dashboard
router.get('/dashboard', getAdminDashboardData);

export default router;
