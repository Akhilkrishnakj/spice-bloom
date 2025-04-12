import userModel from "../models/userModel.js";
import { hashPassword ,comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";


export const registerController = async (req, res) => {
    try {
        console.log(req.body);
      const { name, email, password, phone, confirmPassword } = req.body;
  
      // validation
      if (!name) return res.send({ message: "Name is required" });
      if (!email) return res.send({ message: "Email is required" });
      if (!password) return res.send({ message: "Password is required" });
      if (!phone) return res.send({ message: "Phone is required" });
      if (!confirmPassword) return res.send({ message: "Confirm Password is required" });
  
      // check user
      const user = await userModel.findOne({ email });
      if (user) {
        return res.status(200).send({
          success: false,
          message: "User already registered",
        });
      }
  
      // hash password
      const hashedPassword = await hashPassword(password);
  
      // register user
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        phone
       });
  
      await newUser.save();

      console.log(newUser);
  
      return res.status(201).send({
        success: true,
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error in registration",
        error,
      });
    }
};

export const loginController = async (req, res) => {
    try {
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const { email, password } = req.body;
        // validation
        if(!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        // check user   
      const user = await userModel.findOne({ email }); 
      if(!user){
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
      }
      const match = await comparePassword(password,user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid credentials",
            });
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
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
}
  


export const testController = (req, res) => {
    res.send("Protected Route");
}



