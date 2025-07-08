import Otp from '../models/otp.js';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js'
import { hashPassword } from '../helpers/authHelper.js';
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const cleanEmail = email.trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // ✅ Delete old OTPs for this email
    await Otp.deleteMany({ email: cleanEmail });

    // ✅ Save new OTP
    await Otp.create({ email: cleanEmail, otp });
    console.log("Saving OTP to DB...");
    console.log("OTP saved.");

    // ✅ Send mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: cleanEmail,
      subject: "Your Spice Bloom OTP Code",
      text: `Your One-Time Password (OTP) is: ${otp}. Please use this code to complete your verification. Do not share this OTP with anyone.`
    };

    console.log("Sent OTP:", otp);
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};


export const verifyOTP = async (req, res) => {
  const { name, email, phone, otp, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  console.log("📩 OTP verification requested:");
  console.log({ name, email: cleanEmail, phone, otp, password });

  try {
    const otpEntry = await Otp.findOne({
      email: cleanEmail,
      otp: otp.toString().trim()
    });

    console.log("🔍 OTP entry found in DB:", otpEntry);

    if (!otpEntry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email: cleanEmail,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    const token = JWT.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteMany({ email: cleanEmail });

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
