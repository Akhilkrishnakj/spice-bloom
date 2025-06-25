import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, confirmPassword } = req.body;

    // === Validation ===
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res.status(400).send({ message: "Password must be at least 6 characters" });
    }
    if (!confirmPassword) {
      return res.status(400).send({ message: "Confirm Password is required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Phone is required" });
    }

    // === Check if user already exists ===
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already registered",
      });
    }

    // === Hash password ===
    const hashedPassword = await hashPassword(password);

    // === Create user ===
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      wallet: 5000, // Signup bonus
      transactions: [
        {
          type: 'bonus',
          amount: 5000,
          date: new Date(),
          description: 'Signup Bonus',
          balanceAfter: 5000
        }
      ]
    });

    await newUser.save();

    // === Generate JWT token (optional) ===
    const token = JWT.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // === Send response ===
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      token,
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check password match
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send response to frontend
    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Example protected route
export const testController = (req, res) => {
  res.send("Protected Route");
};


