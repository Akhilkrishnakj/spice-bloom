import express from 'express';
import { createProductController, getAllProductsController,deleteProductController,updateProductController, getProductById, getRelatedProductsController } from '../controllers/productController.js';
import upload from '../middlewares/upload.js'; 
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, upload.array('images', 3), createProductController);
router.get('/get-product', getAllProductsController);
router.get('/get-product/:id', getProductById);
router.get('/related/:categoryId', getRelatedProductsController);
router.delete('/delete-product/:id', requireSignIn, isAdmin, deleteProductController);
router.put('/update-product/:id', requireSignIn, isAdmin, upload.array('images', 3), updateProductController);

console.log("✅ Product route loaded");

export default router;
