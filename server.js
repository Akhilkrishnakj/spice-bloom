import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './config/db.js';
import { autoCancelUnpaidCOD } from './utils/ autoCancelCOS.js';

// Routes
import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';
import adminRoute from './routes/adminRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import userRoutes from './routes/userRoutes.js';
import offerRoute from './routes/offerRoute.js';
import orderRoute from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import addressRoute from './routes/addressRoute.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoute from './routes/notificationRoute.js';
import walletRoute from './routes/walletRoute.js';

// Config dotenv
dotenv.config();
console.log("✅ TEST ENV:", process.env.NODEMAILER_EMAIL, process.env.NODEMAILER_PASSWORD);

// Create app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Main Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/offer', offerRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/address', addressRoute);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoute);
app.use('/api/v1/wallet', walletRoute);

// Default route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to SpiceMart Website</h1>');
});

// Start auto-cancel background job
autoCancelUnpaidCOD();

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`.bgMagenta.white);
});
