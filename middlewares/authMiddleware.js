import e from 'express';
import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // ✅ split Bearer
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", decode);
        req.user = decode; // Save user data in request
        next();
    } catch (error) {
        console.error("JWT error:", error.message);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id); // This only works if req.user is set
        if (user.role !== 1) {
            return res.status(403).json({
                success: false,
                message: "Access Denied - Admin Only",
            });
        } else {
            next();
        }
    } catch (error) {
        console.error("Admin Check Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
