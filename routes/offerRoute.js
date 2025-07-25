import express from "express";
import { createOffer, getAllOffers, updateOffer, deleteOffer } from "../controllers/offerController.js";

const router = express.Router();

router.post("/", createOffer);
router.get("/", getAllOffers);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

export default router;
