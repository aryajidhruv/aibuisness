// Mongoose package ko import kar rahe hain taaki Database (MongoDB) se connect kar sakein
const mongoose = require('mongoose');

// Ek naya 'Schema' bana rahe hain user ki details, Password aur OAuth tokens store karne ke liye
const userSchema = new mongoose.Schema({

  // Google ki taraf se milne wali unique ID (Normal email signup mein yeh khaali rahegi)
  googleId: {
    type: String,
    unique: true,
    sparse: true // 🔥 MAGIC FIX: Yeh null values mein duplicate key error aane se rokta hai
  },

  // User ka poora naam store karne ke liye
  name: {
    type: String,
    required: true
  },

  // User ka email address store karne ke liye
  email: {
    type: String,
    required: true,
    unique: true    // Ek email se ek hi account banega
  },

  // Normal Email+Password se signup karne waalon ke liye (Google auth mein yeh khaali rahega)
  password: {
    type: String,
    required: function() {
      return !this.googleId; // 🔥 DYNAMIC VALIDATION: Agar googleId nahi hai, toh password required hoga
    }
  },

  // User ki Google profile photo ka link store karne ke liye
  avatar: {
    type: String,
    default: null
  },

  // ── GMAIL & OAUTH ACCESS TOKENS (EXTENDED) ──
  
  // accessToken short-lived hota hai. Yeh Google APIs run karne ke kaam aata hai.
  accessToken: {
    type: String,
    default: null
  },

  // refreshToken long-lived hota hai. Isse naya token generate hota hai.
  refreshToken: {
    type: String,
    default: null
  }
}, { 
  timestamps: true // 🔥 Pro-Tip: Yeh automatic 'createdAt' aur 'updatedAt' dono manage karega
});

// Is schema ko 'User' naam ke model mein convert karke export kar rahe hain
module.exports = mongoose.model('User', userSchema); // Capital 'User' convention standard hai