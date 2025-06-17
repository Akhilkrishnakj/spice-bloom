import productModel from '../models/productModel.js';
import slugify from 'slugify';
import cloudinary from  '../config/cloudinary.js';

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    // ✅ Get cloudinary URLs
    const imageUrls = req.files.map(file => file.path);

    // Validation
    if (!name || !price || !category || !quantity) {
      return res.status(400).send({ error: "All required fields must be filled" });
    }

    const product = new productModel({
      name,
      slug: slugify(name),
      description,
      price,
      category,
      quantity,
      shipping,
      images: imageUrls,
    });

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: "Error in product creation" });
  }
};

// In controllers/productController.js
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    res.status(200).send({
      success: true,
      message: "All Products Fetched",
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};

// update product controller

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
    };

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      updateData.images = imageUrls;
    }

    const product = await productModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error: err.message,
    });
  }
};

// delete product controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error: err.message,
    });
  }
};

export const getProductById = async (req,res)=>{
  try {
    const product = await productModel.findById(req.params.id).populate("category");
    if(!product){
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });    
    }
    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error Fetching Product"
    });
  }
}