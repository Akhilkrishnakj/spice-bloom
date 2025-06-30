// controllers/userController.js
import userModel from "../models/userModel.js";
import Order from "../models/orderModel.js";

const DEFAULT_PROFILE_IMAGE = 'https://imgs.search.brave.com/d3lvpgl8vJsPCMoI_aQMaWe0MymkSAc4y9KtWcdp-rQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Ymx1ZS1jaXJjbGUt/d2l0aC13aGl0ZS11/c2VyXzc4MzcwLTQ3/MDcuanBnP3NlbXQ9/YWlzX2l0ZW1zX2Jv/b3N0ZWQmdz03NDA';

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format the response with additional computed fields
    const userData = {
      _id: user._id,
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      profilePic: user.profilePic && user.profilePic.trim() !== '' ? user.profilePic : DEFAULT_PROFILE_IMAGE,
      coverPic: user.coverPic || '',
      bio: user.bio || '',
      wallet: user.wallet || 0,
      joinDate: user.createdAt,
      wishlist: user.wishlist || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json(userData);
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, profilePic } = req.body;
    
    // Only allow updating specific fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    
    // Handle profile image update
    if (profilePic !== undefined) {
      // If profilePic is an empty string, store it as empty
      if (profilePic === '') {
        updateData.profilePic = '';
      } else if (typeof profilePic === 'string') {
        if (profilePic.startsWith('data:image/')) {
          // Validate base64 size (max 5MB)
          const base64Size = Math.ceil((profilePic.length * 3) / 4);
          if (base64Size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'Image size should be less than 5MB' });
          }
          updateData.profilePic = profilePic;
        } else if (profilePic.startsWith('http')) {
          // It's a URL, allow it
          updateData.profilePic = profilePic;
        } else {
          return res.status(400).json({ error: 'Invalid image format' });
        }
      }
    }
    
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count total orders for this user
    const totalOrders = await Order.countDocuments({ user: userId });
    
    // Count wishlist items
    const user = await userModel.findById(userId).populate('wishlist');
    const wishlistCount = user?.wishlist?.length || 0;
    
    // Get wallet balance
    const walletBalance = user?.wallet || 0;
    
    // Calculate reward points (example: 1 point per order)
    const rewardPoints = totalOrders * 10;

    res.json({ 
      totalOrders,
      wishlistCount,
      walletBalance,
      rewardPoints
    });
  } catch (err) {
    console.error('Error in getUserStats:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};