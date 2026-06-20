import React from 'react';
// 1. Google ka bana-banaya ready button import kiya
import { GoogleLogin } from '@react-oauth/google';
// 2. CORRECTION: Backend API par data bhejne ke liye sahi axios import kiya 
import axios from 'axios';
import { env } from '../config/env.js';

const Login = ({ navigate }) => { // Props mein 'navigate' ko receive kiya
  
  // 3. Yeh function tab chalega jab user Google par successfully login kar lega
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // credentialResponse.credential ke andar Google ek lamba sa 'ID Token' (JWT) deta hai
      console.log("Google se token mil gaya:", credentialResponse.credential);

      // 4. Axios ke zariye hum is Token ko apne Node.js Backend (/api/auth/google) par bhej rahe hain
      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential, 
      });

      // 5. Backend check karega, agar user naya hai toh DB mein save karega, aur apna ek Token waapas bhejega
      console.log('Backend se response aaya:', res.data);
      
      // 6. Backend se mile huye token ko hum browser ke LocalStorage mein save kar lete hain
      localStorage.setItem('token', res.data.token);
      
      alert('Login Successful! 🎉 Welcome to CallIQ');
      
      // 7. Custom state routing trigger!
      navigate('dashboard');

    } catch (error) {
      // Agar backend band hai ya koi error aaya toh yeh chalega
      console.error('Backend authentication mein error aaya:', error);
      alert('Backend se connect nahi ho paya, login failed.');
    }
  };

  // 8. Yeh function tab chalega agar user ne login cancel kar diya ya Google ki taraf se koi dikkat aayi
  const handleGoogleError = () => {
    console.log('Google Login Failed atau cancel ho gaya');
    alert('Google Login Failed. Please try again.');
  };

  return (
    // Tailwind CSS ka use karke poore page ko center mein laya gaya hai
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Ek sundar sa white color ka card box */}
      <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome to CallIQ</h2>
        <p className="text-gray-600 mb-6">Sign in with your Google account to get started</p>
        
        {/* 9. Yeh hai asli Google Button component */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess} // Success hone par upar wala function chalega
            onError={handleGoogleError}     // Fail hone par error wala function chalega
            theme="filled_blue"             // Button ka color blue set kiya
            size="large"                    // Button ka size bada rakha
            text="signin_with"              // Button par "Sign in with Google" likha aayega
            shape="rectangular"             // Button ki shape square-ish hogi
          />
        </div>
      </div>
    </div>
  );
};

export default Login;