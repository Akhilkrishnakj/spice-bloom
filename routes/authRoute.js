import express from 'express';
import { registerController, loginController, testController } from '../controllers/authController.js';
import {  isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { sendOTP, verifyOTP } from "../controllers/otpController.js";


//router object
const router = express.Router();

//register
router.post('/signup',registerController)

//login || method = post
router.post('/login',loginController)

router.get('/test',requireSignIn,isAdmin, testController)

//send OTP
router.post('/send-otp', sendOTP);

//verify OTP
router.post('/verify-otp', verifyOTP);

router.get('/admin-dashboard', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

export default router;