import productModel from '../models/productModel.js';
import slugify from 'slugify';
import cloudinary from  '../config/cloudinary.js';

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping, benefits } = req.body;

    // Defensive check for images
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ error: "At least one product image is required" });
    }
    const imageUrls = req.files.map(file => file.path);

    // Validation
    if (!name || !price || !category || !quantity) {
      return res.status(400).send({ error: "All required fields must be filled" });
    }

    // Parse benefits if it's a string
    let benefitsArray = [];
    if (benefits) {
      if (typeof benefits === 'string') {
        benefitsArray = benefits.split(',').map(benefit => benefit.trim()).filter(benefit => benefit);
      } else if (Array.isArray(benefits)) {
        benefitsArray = benefits;
      }
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
      benefits: benefitsArray,
    });

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    // Improved error logging
    console.error('Product creation error:', error, error.stack);
    res.status(500).send({ success: false, error: "Error in product creation", details: error.message });
  }
};

// In controllers/productController.js
export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find().populate("category");
    console.log('Products from DB:', products);
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
    const { name, description, price, category, quantity, benefits } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
    };

    // Parse benefits if it's a string
    if (benefits !== undefined) {
      let benefitsArray = [];
      if (benefits) {
        if (typeof benefits === 'string') {
          benefitsArray = benefits.split(',').map(benefit => benefit.trim()).filter(benefit => benefit);
        } else if (Array.isArray(benefits)) {
          benefitsArray = benefits;
        }
      }
      updateData.benefits = benefitsArray;
    }

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

// Get related products by category
export const getRelatedProductsController = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { productId } = req.query; // To exclude current product

    // Build query to find products in same category
    let query = { category: categoryId };
    
    // Exclude current product if productId is provided
    if (productId) {
      query._id = { $ne: productId };
    }

    const relatedProducts = await productModel
      .find(query)
      .populate("category")
      .limit(4) // Limit to 4 products
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: "Related products fetched successfully",
      products: relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching related products",
      error: error.message,
    });
  }
};