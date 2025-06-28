import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login?error=google_auth_failed',
    session: false
  }),
  (req, res) => {
    try {
      console.log('Google auth callback - User data:', {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user._id,
          email: req.user.email,
          role: req.user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('Generated JWT token:', token.substring(0, 50) + '...');

      // Redirect to frontend with token
      const redirectUrl = req.user.role === 1 // 1 for admin
        ? `http://localhost:3000/admin/dashboard?token=${token}`
        : `http://localhost:3000/success?token=${token}`;
      
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth callback error:', error);
      res.redirect('http://localhost:3000/login?error=token_generation_failed');
    }
  }
);

export default router;
