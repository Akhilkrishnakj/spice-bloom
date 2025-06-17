import express from 'express';
import { createProductController, getAllProductsController,deleteProductController,updateProductController, getProductById } from '../controllers/productController.js';
import upload from '../middlewares/upload.js'; 

const router = express.Router();

router.post('/create-product', upload.array('images', 3), createProductController);
router.get('/get-product', getAllProductsController);
router.get('/get-product/:id', getProductById);
router.delete('/delete-product/:id', deleteProductController);
router.put('/update-product/:id', upload.array('images', 3), updateProductController);

console.log("✅ Product route loaded");

export default router;
