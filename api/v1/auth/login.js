import { loginController } from '../../../controllers/authController.js';
import connectDB from '../../../config/db.js';

export default async function handler(req, res) {
  // Connect to database
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      allowedMethods: ['POST'],
      message: 'Only POST method is allowed for login'
    });
  }

  try {
    // Call the login controller
    await loginController(req, res);
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
} 