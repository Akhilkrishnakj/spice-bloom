import Address from "../models/addressModel.js";

// @desc    Get all addresses of the logged-in user
// @route   GET /api/v1/address
// @access  Private
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
};

// @desc    Create a new address for the logged-in user
// @route   POST /api/v1/address
// @access  Private
export const createAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(address);
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ success: false, message: "Failed to create address" });
  }
};

// @desc    Delete a user's address
// @route   DELETE /api/v1/address/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting address:", id);
    console.log("User from token:", req.user); // 🟢 This must contain _id

    const address = await Address.findOneAndDelete({ _id: id, user: req.user._id });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found or not authorized" });
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
};
