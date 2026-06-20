// Mongoose package ko import kar rahe hain taaki Database (MongoDB) se connect kar sakein
const mongoose = require('mongoose');

// Ek naya 'Schema' (yani database ka table structure) bana rahe hain user ki details store karne ke liye
const userSchema = new mongoose.Schema({

  // Google ki taraf se milne wali unique ID ko store karne ke liye
  googleId: {
    type: String,
    required: true, // Yeh ID honi hi chahiye, iske bina data nahi save hoga
    unique: true    // Do users ki same Google ID nahi ho sakti
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

  // User ki Google profile photo ka link store karne ke liye
  avatar: {
    type: String
  },
  
  // Account kab bana, uski date aur time auto-store karne ke liye
  createdAt: {
    type: Date,
    default: Date.now // Agar hum date nahi bhejenge, to ye apne aap current time daal dega
  }
});

// Is schema ko 'User' naam ke model mein convert karke export kar rahe hain taaki baaki files ise use kar sakein
module.exports = mongoose.model('User', userSchema);