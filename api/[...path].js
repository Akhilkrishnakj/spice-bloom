import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';

// Import all routes
import authRoute from '../routes/authRoute.js';
import productRoute from '../routes/productRoute.js';
import adminRoute from '../routes/adminRoute.js';
import categoryRoute from '../routes/categoryRoute.js';
import userRoutes from '../routes/userRoutes.js';
import offerRoute from '../routes/offerRoute.js';
import orderRoute from '../routes/orderRoute.js';
import paymentRoute from '../routes/paymentRoute.js';
import addressRoute from '../routes/addressRoute.js';
import dashboardRoutes from '../routes/dashboardRoutes.js';
import notificationRoute from '../routes/notificationRoute.js';
import walletRoute from '../routes/walletRoute.js';
import couponRoute from '../routes/couponRoute.js';
import googleRoute from '../routes/googleRoute.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB().catch(console.error);

// Create Express app
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",          
    "https://spicebloom.vercel.app"    
  ],
  credentials: true
}));

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/auth', googleRoute);
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
app.use('/api/v1/coupon', couponRoute);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'SpiceMart API is running' });
});

// Export the Express app
export default app; 