import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js'; // ✅ correct import

export const requireSignIn = async (req, res, next) => {
  try {
    console.log("Auth header:", req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id || decoded.id; // Handle both _id and id
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    console.log("Admin check - req.user:", req.user);
    if (!req.user || req.user.role !== 1 ) {
      console.log("User is not admin:", req.user);
      return res.status(403).json({ error: "Access denied. Not admin." });
    }
    next();
  } catch (err) {
    console.error("Admin Check Error:", err);
    res.status(500).json({ error: "Admin middleware failed" });
  }
};
