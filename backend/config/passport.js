// Passport package aur Google OAuth 2.0 strategy ko import kar rahe hain
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Jo User model humne abhi upar banaya tha, use yahan lekar aa rahe hain
const User = require('../Models/user');

// Passport ko bata rahe hain ki use Google Login use karna hai
passport.use(
  new GoogleStrategy(
    {
      // .env file se Google ki API credentials utha rahe hain
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // Login hone ke baad browser isi URL par wapas aayega
    },
    // Jab user Google par login kar lega, to Google hume uska profile data bhejega (accessToken, refreshToken, profile)
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Pehle database mein check karo ki kya ye user pehle bhi kabhi login kar chuka hai?
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Agar user mil gaya, to usko bolo "Welcome back!" aur aage bhej do
          return done(null, user);
        }

        // 2. Agar user database mein nahi mila, iska matlab ye naya banda hai. Iska naya account banao!
        user = await User.create({
          googleId: profile.id, // Google ki unique ID
          name: profile.displayName, // User ka naam
          email: profile.emails[0].value, // User ka primary email
          avatar: profile.photos[0].value, // User ki profile photo
        });

        // Naya user banne ke baad use aage bhej do
        return done(null, user);
      } catch (error) {
        // Agar is poore process mein koi error aata hai, to use handle karo
        console.error("Google Auth mein dikkat aayi:", error);
        return done(error, null);
      }
    }
  )
);

// Ye export karna zaroori hai taaki index.js file ko pata chale ki passport ready hai
module.exports = passport;