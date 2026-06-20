import React, { useState } from 'react';
// 1. Google ka bana-banaya ready button import kiya
import { GoogleLogin } from '@react-oauth/google';
// 2. CORRECTION: Backend API par data bhejne ke liye sahi axios import kiya 
import axios from 'axios';
import { env } from '../config/env.js';

const Login = ({ navigate }) => { // Props mein 'navigate' ko receive kiya
  
  // State variables traditional email aur password login ke liye
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Traditional Email/Password Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Traditional login attempt with:", email);
      
      // Backend par login request bhejna
      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log('Backend se response aaya:', res.data);
      localStorage.setItem('token', res.data.token);
      alert('Login Successful! 🎉 Welcome back.');
      navigate('dashboard');

    } catch (error) {
      console.error('Email Login Error:', error);
      alert(error.response?.data?.message || 'Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };
  
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Ek sundar sa white color ka card box - width max-w-md kar di thodi space ke liye */}
      <div className="p-8 bg-white rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-950 tracking-tight">Welcome to CallIQ</h2>
        <p className="text-sm text-gray-500 mb-8">Sign in to manage your business analytics</p>
        
        {/* 9. Yeh hai asli Google Button component */}
        <div className="flex justify-center w-full mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess} // Success hone par upar wala function chalega
            onError={handleGoogleError}     // Fail hone par error wala function chalega
            theme="filled_blue"             // Button ka color blue set kiya
            size="large"                    // Button ka size bada rakha
            text="signin_with"              // Button par "Sign in with Google" likha aayega
            shape="rectangular"             // Button ki shape square-ish hogi
            width="100%"                    // Layout responsive karne ke liye width fluid rakhi
          />
        </div>

        {/* Beautiful Custom OR Divider */}
        <div className="relative flex py-4 items-center w-full mb-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Or login with email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Traditional Email & Password Form Section */}
        <form onSubmit={handleEmailLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <a href="#forgot" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-200 hover:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-sm text-gray-600 mt-6">
  Don't have an account?{' '}
  <button 
    onClick={() => navigate('signup')} 
    className="font-semibold text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer inline-block"
  >
    Sign up
  </button>
</p>
      </div>
    </div>
  );
};

export default Login;