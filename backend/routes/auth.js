// Zaruri packages ko import kar rahe hain
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../Models/user');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -------------------------------------------------------------------------
// Route 0: Frontend Google Sign-In button se aaya hua ID token verify karna
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

    if (!user) {
      user = await User.create({
        googleId,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
      });
    }

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
// Route 1: Jab user "Login with Google" button par click karega
// -------------------------------------------------------------------------
router.get(
  '/google',
  // Passport ko bol rahe hain ki user ko Google ke login page par redirect (bhej) kare
  // 'profile' aur 'email' ka matlab hume user ka naam, photo aur email chahiye
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// -------------------------------------------------------------------------
// Route 2: Jab user Google par login kar lega, to Google is URL par wapas bhejega
// -------------------------------------------------------------------------
router.get(
  '/google/callback',
  // Agar login fail ho gaya, to user ko wapas login page par bhej do
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      // req.user mein hume login kiye hue user ka data mil jata hai jo passport ne nikaala tha
      const user = req.user;

      // 1. Ek naya JWT Token bana rahe hain jisme user ki Database ID chhupi hogi
      // Yeh token 7 din tak valid rahega (7d)
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );

      // 2. Token ko 'httpOnly' cookie ke andar daal kar browser ko de rahe hain
      res.cookie('token', token, {
        httpOnly: true,                 // JavaScript is token ko read nahi kar sakti (Security ke liye best hai!)
        secure: process.env.NODE_ENV === 'production', // Sirf HTTPS (secure network) par chalega jab live hoga
        sameSite: 'lax',                // CSRF attacks se bachane ke liye
        maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie ki umar (7 din milliseconds mein)
      });

      // 3. Sab sahi hone ke baad, user ko frontend ke dashboard page par bhej do
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);

    } catch (error) {
      console.error("Callback mein dikkat aayi:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// -------------------------------------------------------------------------
// Route 3: User ko logout karne ke liye API
// -------------------------------------------------------------------------
router.get('/logout', (req, res) => {
  // Browser se 'token' naam ki cookie ko mita do (clear kar do)
  res.clearCookie('token');
  
  // Frontend ko message bhej do ki logout ho gaya hai
  res.json({ message: "Logged out successfully!" });
});

// Is router ko export kar rahe hain taaki main server file (index.js) ise use kar sake
module.exports = router;