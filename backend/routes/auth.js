// Zaruri packages ko import kar rahe hain
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 🔥 FIXED: Password securely hash karne ke liye import kiya
const { OAuth2Client } = require('google-auth-library');
const User = require('../Models/user'); // Match exact case (User.js)

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function JWT token generate karne ke liye (Code repetitive na ho)
const generateTokenAndSetCookie = (user, res) => {
  const authToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return authToken;
};

// -------------------------------------------------------------------------
// 🔥 NEW FIXED ROUTE: Normal Email + Password Signup (`POST /api/auth/register`)
// -------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation check
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check karo user pehle se exist toh nahi karta
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    // 3. Password ko hash karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Naya user MongoDB Atlas par create karo
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    console.log("Naya Email User Atlas cloud par save ho gaya! 🎉:", newUser.email);

    // 5. Token generate karke cookie set karo
    const authToken = generateTokenAndSetCookie(newUser, res);

    // 6. Response pack karke bhejo
    res.status(201).json({
      token: authToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Email signup mein error aaya:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// -------------------------------------------------------------------------
// Route 0: Frontend Google Custom SDK Login/Signup button se aaya token (`POST /api/auth/google`)
// -------------------------------------------------------------------------
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body; 

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });

    // SIGNUP FLOW: Agar user nahi mila database mein, toh naya user banao
    if (!user) {
      user = await User.create({
        googleId,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        accessToken: req.body.accessToken || null,
        refreshToken: req.body.refreshToken || null
      });
      console.log("Naya user successfully register ho gaya (Signup):", user.email);
    } else {
      // LOGIN FLOW: Existing user ke tokens update karo
      if (req.body.accessToken) user.accessToken = req.body.accessToken;
      if (req.body.refreshToken) user.refreshToken = req.body.refreshToken;
      await user.save();
      console.log("Purana user successfully login ho gaya (Login):", user.email);
    }

    const authToken = generateTokenAndSetCookie(user, res);

    res.json({
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google token verification failed:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// -------------------------------------------------------------------------
// Route 1: Direct Link Redirect Auth (`GET /api/auth/google`)
// -------------------------------------------------------------------------
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: [
      'profile', 
      'email', 
      'https://www.googleapis.com/auth/gmail.readonly'
    ],
    accessType: 'offline', 
    prompt: 'select_account'
  })
);

// -------------------------------------------------------------------------
// Route 2: Google Callback Handler (`GET /api/auth/google/callback`)
// -------------------------------------------------------------------------
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user; 

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
      }

      const dbUser = await User.findById(user._id);
      if (dbUser) {
        if (user.accessToken) dbUser.accessToken = user.accessToken;
        if (user.refreshToken) dbUser.refreshToken = user.refreshToken;
        await dbUser.save();
      }

      generateTokenAndSetCookie(user, res);
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);

    } catch (error) {
      console.error("Callback mein dikkat aayi:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// -------------------------------------------------------------------------
// Route 3: Logout Endpoint
// -------------------------------------------------------------------------
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully!" });
});

module.exports = router;