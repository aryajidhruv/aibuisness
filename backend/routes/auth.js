// Zaruri packages ko import kar rahe hain
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../Models/user');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
// Email + Password Signup
// -------------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    console.log("Naya Email User Atlas cloud par save ho gaya! 🎉:", newUser.email);

    const authToken = generateTokenAndSetCookie(newUser, res);

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
// Google Login — Frontend SDK se aaya token
// -------------------------------------------------------------------------
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    // ✅ Token verify karo
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        accessToken: req.body.accessToken || null,
        refreshToken: req.body.refreshToken || null
      });
      console.log("✅ Naya user registered (Signup):", user.email);
    } else {
      if (req.body.accessToken) user.accessToken = req.body.accessToken;
      if (req.body.refreshToken) user.refreshToken = req.body.refreshToken;
      await user.save();
      console.log("✅ Purana user logged in:", user.email);
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
    // ✅ Full error message print hoga terminal mein
    console.error('❌ Google token verification failed:', error.message);
    res.status(401).json({ 
      message: 'Invalid Google token', 
      detail: error.message  // ✅ Frontend pe bhi aayega
    });
  }
});

// -------------------------------------------------------------------------
// Passport Google Redirect
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
// Google Callback
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
      console.error("❌ Callback mein dikkat aayi:", error.message);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// -------------------------------------------------------------------------
// Route: Check if user is logged in via cookie
// -------------------------------------------------------------------------
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------------------------------------------------
// Logout
// -------------------------------------------------------------------------
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully!" });
});

module.exports = router;