import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/userModel.js';

import connectDB from './config/db.js';
import { autoCancelUnpaidCOD } from './utils/ autoCancelCOS.js';
import trackingService from './utils/trackingService.js';

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
import couponRoute from './routes/couponRoute.js';
import googleRoute from './routes/googleRoute.js';

// Config dotenv
console.log("✅ TEST ENV:", process.env.NODEMAILER_EMAIL, process.env.NODEMAILER_PASSWORD);

import MongoStore from 'connect-mongo';

// Initialize Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
          googleId: profile.id,
          role: 0, // 0 for regular user
          active: true,
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Create app
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://spicebloom.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
});


// 🚚 Enhanced Socket.IO with tracking functionality
io.on("connection",(socket)=>{
  console.log("🔌 User connected:", socket.id);
  
  // Join user to their personal room for targeted updates
  socket.on("join-user-room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Join admin room for admin-specific updates
  socket.on("join-admin-room", () => {
    socket.join("admin-room");
    console.log("👨‍💼 Admin joined admin room");
  });

  // Handle tracking updates
  socket.on("tracking-update", (data) => {
    console.log("📡 Broadcasting tracking update:", data.orderNumber);
    io.emit("tracking-update", data);
  });

  // Handle order status updates
  socket.on("order-status-update", (data) => {
    console.log("📦 Broadcasting order status update:", data.orderNumber);
    io.emit("order-status-update", data);
  });

  // Handle delivery notifications
  socket.on("delivery-notification", (data) => {
    console.log("🚚 Broadcasting delivery notification:", data.orderNumber);
    io.emit("delivery-notification", data);
  });

  socket.on("disconnect",()=>{
    console.log("🔌 User disconnected:", socket.id);
  })
})

// Set up global.io for tracking service
global.io = io;

export { io };

// Connect to DB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:3000",          
    "https://spicebloom.vercel.app"    
  ],
  credentials: true
}));
app.set("trust proxy", 1); 


// Session configuration for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Main Routes
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
  res.send('<h1>Welcome to SpiceMart Website</h1>');
});

// Start auto-cancel background job
autoCancelUnpaidCOD();

// 🚚 Initialize tracking service
console.log('🚀 Initializing Tracking Service...');
trackingService.initializeTracking();

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`.bgMagenta.white);
  console.log(`🚚 Tracking Service: Active`.green);
  console.log(`📡 Socket.IO: Ready`.blue);
});
