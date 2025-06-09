// /controllers/categoryController.js
import Category from "../models/categoryModel.js";
import slugify from "slugify";

// CREATE
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists" });

    const category = await new Category({ name, slug: slugify(name) }).save();
    res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// READ ALL
export const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json({ success: true, categories });
};

// READ SINGLE
export const getCategory = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  res.json({ success: true, category });
};

// UPDATE
export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, slug: slugify(name) },
    { new: true }
  );
  res.json({ success: true, message: "Category updated", category });
};

// DELETE
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
};
