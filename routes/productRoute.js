import express from 'express';
import { createProductController, getAllProductsController } from '../controllers/productController.js';
import upload from '../middlewares/upload.js'; 

const router = express.Router();

router.post('/create-product', upload.array('images', 3), createProductController);
router.get('/get-product', getAllProductsController);

export default router;
