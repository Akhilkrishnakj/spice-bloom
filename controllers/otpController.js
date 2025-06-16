import Otp from '../models/otp.js';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js'
import { hashPassword } from '../helpers/authHelper.js';
import dotenv from "dotenv";
dotenv.config();


export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    console.log("Saving OTP to DB...");
// await Otp.create({ email, otp });
    console.log("OTP saved.");



    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
      
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    };

    console.log("Sent OTP:", otp);
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
    
    console.log("EMAIL:", process.env.NODEMAILER_EMAIL);
    console.log("PASSWORD:", process.env.NODEMAILER_PASSWORD);

  }
};import JWT from "jsonwebtoken";

export const verifyOTP = async (req, res) => {
  const { name, email, phone, otp, password } = req.body;

  console.log("📩 OTP verification requested:");
  console.log({ name, email, phone, otp, password });

  try {
    const otpEntry = await Otp.findOne({
      email: email.trim(),
      otp: otp.toString().trim()
    });

    console.log("🔍 OTP entry found in DB:", otpEntry);

    if (!otpEntry) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ Hash password and save user
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Generate token
    const token = JWT.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Clean up OTP
    await Otp.deleteMany({ email });

    // ✅ Send token + user
    res.json({
      success: true,
      message: "User created and verified successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};
