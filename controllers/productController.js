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
