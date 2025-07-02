import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.REACT_APP_URL}/login?error=google_auth_failed`,
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
      const frontendUrl = process.env.FRONTEND_URL || 'https://spicebloom.vercel.app';
      const redirectUrl = req.user.role === 1 // 1 for admin
        ? `${frontendUrl}/admin/dashboard?token=${token}`
        : `${frontendUrl}/success?token=${token}`;
      
      console.log('Redirecting to:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'https://spicebloom.vercel.app';
      res.redirect(`${frontendUrl}/login?error=token_generation_failed`);
    }
  }
);

export default router;
