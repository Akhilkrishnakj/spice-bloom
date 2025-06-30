// controllers/adminController.js
import User from "../models/userModel.js";


export const getAdminDashboardData = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Admin dashboard data",
      data: {
        users: 10,
        products: 25,
        orders: 12,
      }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    console.log("Admin route accessed by:", req.user.name);
    
    const users = await User.find({}).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users: users,
      currentUser: req.user
    });
  } catch (error) {
    console.error('Admin route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};
