import express from "express";
import {
  getUserAddresses,
  createAddress,
  deleteAddress
} from "../controllers/addressController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/',requireSignIn,getUserAddresses)
router.post("/", requireSignIn, createAddress);
router.delete("/:id", requireSignIn, deleteAddress);

export default router;
