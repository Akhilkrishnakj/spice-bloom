// /routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryControllers.js";

const router = express.Router();

router.post("/create", createCategory);
router.get("/all", getCategories);
router.get("/:slug", getCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
