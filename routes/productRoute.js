import express from 'express';
import { createProductController, getAllProductsController,deleteProductController,updateProductController } from '../controllers/productController.js';
import upload from '../middlewares/upload.js'; 

const router = express.Router();

router.post('/create-product', upload.array('images', 3), createProductController);
router.get('/get-product', getAllProductsController);
router.delete('/delete-product/:id', deleteProductController);
router.put('/update-product/:id', upload.array('images', 3), updateProductController);

export default router;
