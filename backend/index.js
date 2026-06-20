// Sabse pehle .env file ko load kar rahe hain taaki saari secret keys access ho sakein
require('dotenv').config();
const { validateEnv } = require('./config/env');
validateEnv();

// Zaruri packages ko import kar rahe hain
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Jo passport ki configuration humne config folder mein likhi thi, use yahan load kar rahe hain
require('./config/passport');

// Jo authentication waale routes (APIs) banaye the, unhe import kar rahe hain
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// -------------------------------------------------------------------------
// Middlewares (Server ke security aur data filters)
// -------------------------------------------------------------------------

// CORS isliye lagaya hai taaki aapka React Frontend (Localhost 5173) is Backend se baat kar sake
app.use(cors({
  origin: process.env.CLIENT_URL, // Sirf isi frontend URL ko data lene ki permission hogi
  credentials: true               // Isse frontend aur backend aapas mein cookies share kar payenge
}));

// Server ko bol rahe hain ki agar koi JSON data aaye to use samajh sake
app.use(express.json());

// Cookies ko read karne ke liye parser lagana zaroori hai (Kyuki hum JWT token cookie mein rakh rahe hain)
app.use(cookieParser());

// Passport auth engine ko server ke sath shuru (initialize) kar rahe hain
app.use(passport.initialize());

// -------------------------------------------------------------------------
// MongoDB Database Connection
// -------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database (MongoDB) ekdum kamal tarike se connect ho gaya hai! 🎉"))
  .catch((err) => console.error("Database connection mein error aaya:", err));

// -------------------------------------------------------------------------
// Routes Connection (APIs ko link karna)
// -------------------------------------------------------------------------

// Humne jo login/logout ke routes banaye the, unhe '/api/auth' ke raste par set kar diya hai
// Yani aapka login URL banega: http://localhost:5000/api/auth/google
app.use('/api/auth', authRoutes);

// Ek simple default route check karne ke liye ki server sahi chal raha hai ya nahi
app.get('/', (req, res) => {
  res.send("CallIQ Backend Server up aur running hai!");
});

// -------------------------------------------------------------------------
// Server Start Setup
// -------------------------------------------------------------------------
const server = app.listen(PORT, () => {
  console.log(`Server successfully run ho raha hai port ${PORT} par! 🚀`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Stop the other app or change PORT in .env`);
    process.exit(1);
  }
  throw err;
});