const User = require('/Models/User');

// Google OAuth verification callback ya standard token handle karne ka function
exports.googleAuthCallback = async (req, res) => {
  try {
    // Ye data aapko passport ya front-end ke token verification se milega
    const { googleId, name, email, avatar, accessToken, refreshToken } = req.body;

    // 1. Check karo ki user pehle se database mein exist karta hai ya nahi
    let user = await User.findOne({ googleId });

    if (user) {
      // 2. Agar user mil gaya, toh uske tokens aur profile details update kar do (Latest state save karne ke liye)
      user.name = name;
      user.avatar = avatar;
      user.accessToken = accessToken;
      
      // Refresh token sirf pehli baar milta hai, isliye agar naya aaya ho tabhi update karein
      if (refreshToken) {
        user.refreshToken = refreshToken;
      }

      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully and tokens updated.',
        user
      });
    }

    // 3. Agar user nahi mila, toh naya account banao (Sign Up)
    user = new User({
      googleId,
      name,
      email,
      avatar,
      accessToken,
      refreshToken
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'New user registered via Google successfully.',
      user
    });

  } catch (error) {
    console.error('Google Auth Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed internal server error.'
    });
  }
};

// User Profile Fetch karne ke liye controller (Optional helper)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // JWT ya Session se id nikal kar
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};