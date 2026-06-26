import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { env } from '../config/env.js';

const Login = ({ navigate }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Traditional Email/Password Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Traditional login attempt with:", email);
      
      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      }, { withCredentials: true }); // ✅ Cookie save hogi

      console.log('Backend se response aaya:', res.data);
      // ✅ localStorage hata diya — cookie mein automatically save hoga
      alert('Login Successful! 🎉 Welcome back.');
      navigate('dashboard');

    } catch (error) {
      console.error('Email Login Error:', error);
      alert(error.response?.data?.message || 'Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };
  
  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google se token mil gaya:", credentialResponse.credential);

      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential, 
      }, { withCredentials: true }); // ✅ Cookie save hogi

      console.log('Backend se response aaya:', res.data);
      // ✅ localStorage hata diya — cookie mein automatically save hoga

      alert('Login Successful! 🎉 Welcome to CallIQ');
      navigate('dashboard');

    } catch (error) {
      console.error('Backend authentication mein error aaya:', error);
      alert('Backend se connect nahi ho paya, login failed.');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed atau cancel ho gaya');
    alert('Google Login Failed. Please try again.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="p-8 bg-white rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-950 tracking-tight">Welcome to CallIQ</h2>
        <p className="text-sm text-gray-500 mb-8">Sign in to manage your business analytics</p>
        
        <div className="flex justify-center w-full mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>

        <div className="relative flex py-4 items-center w-full mb-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Or login with email</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

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