import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import connectDB from './config/db.js';
import User from './models/userModel.js';
import trackingService from './utils/trackingService.js';
import { autoCancelUnpaidCOD } from './utils/autoCancelCOS.js';

// Route imports
import authRoute from './routes/authRoute.js';
import googleRoute from './routes/googleRoute.js';
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

const app = express();
const server = http.createServer(app);

// ✅ CORS Setup for Netlify + Localhost
const allowedOrigins = [
  'http://localhost:3000',
  'https://spicebloom.netlify.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Preflight requests
app.options('*', cors());

// ✅ Express setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set("trust proxy", 1);

// ✅ Debugging request logger
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// ✅ MongoDB connect
connectDB();

// ✅ Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

// ✅ Passport for Google Auth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile.photos[0].value,
        googleId: profile.id,
        role: 0,
        active: true
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// ✅ Register routes
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

// ✅ Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ message: 'API is live', time: new Date().toISOString() });
});

// ✅ Catch unknown routes
app.get('/api/*', (req, res) => {
  res.status(404).json({ message: 'Invalid API endpoint' });
});
app.get('/', (req, res) => {
  res.json({ message: '🌶️ Welcome to Spice Bloom API', time: new Date().toISOString() });
});

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on("join-user-room", (userId) => socket.join(`user_${userId}`));
  socket.on("join-admin-room", () => socket.join("admin-room"));
  socket.on("tracking-update", (data) => io.emit("tracking-update", data));
  socket.on("order-status-update", (data) => io.emit("order-status-update", data));
  socket.on("delivery-notification", (data) => io.emit("delivery-notification", data));

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});
global.io = io;

// ✅ Start background services
trackingService.initializeTracking();
autoCancelUnpaidCOD();

// ✅ Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`.bgCyan.white);
  console.log(`📡 Socket.IO Ready`.blue);
});
