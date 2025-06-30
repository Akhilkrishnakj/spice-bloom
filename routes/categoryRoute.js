// routes/categoryRoutes.js
import express from 'express';
import { createCategoryController, getAllCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create-category', createCategoryController);
router.get('/get-category', getAllCategoryController);

export default router;
