import Offer from '../models/offerModel.js';
import Product from '../models/productModel.js';

export const createOffer = async (req, res) => {
  try {
    const { title, discountType, discountValue, startDate, endDate, products } = req.body;

    if (!title || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: "End date must be after start date." });
    }

    // Optional: Check products exist
    if (products && products.length > 0) {
      const validProducts = await Product.find({ _id: { $in: products } });
      if (validProducts.length !== products.length) {
        return res.status(400).json({ success: false, message: "One or more products are invalid." });
      }
    }

    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ success: true, offer });

  } catch (error) {
    console.error("Create offer failed", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllOffers = async (req,res)=>{
 try {
    const offers = await  Offer.find().populate("products","name price").sort({createdAt: -1});
    res.json({success:true,offers})
 } catch (error) {
    console.error("Fetch offers failed",error);
    res.status(500).json({success:false,message:error.message})
 }
}

export const updateOffer = async (req,res)=>{
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {new : true});
        if(!offer) return res.status(404).json({success:false , message: "Offer not found"});
        res.json({success:true , offer})
    } catch (error) {
        console.error("Update offer failed",error);
        res.status(400).json({success:false , message:error.message})
    }
};

export const deleteOffer = async (req,res)=>{
   try {
     const offer = await Offer.findByIdAndDelete(req.params.id);
     if(!offer) return res.status(404).json({success:false , message: "Offer not found"});
     res.json({success:true, message:"Offer delete successfully "})
   } catch (error) {
    console.error("Delete offer failed",error)
    res.status(400).json({success:false,message:error.message})
   }
};