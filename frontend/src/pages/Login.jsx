import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { motion } from 'framer-motion';
import { env } from '../config/env.js';

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const staggerParent = (stagger = 0.08, delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const Login = ({ navigate }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Traditional login attempt with:", email);

      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      }, { withCredentials: true });

      console.log('Backend se response aaya:', res.data);
      alert('Login Successful! 🎉 Welcome back.');
      navigate('dashboard');

    } catch (error) {
      console.error('Email Login Error:', error);
      alert(error.response?.data?.message || 'Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google se token mil gaya:", credentialResponse.credential);

      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      }, { withCredentials: true });

      console.log('Backend se response aaya:', res.data);

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
    <div className="min-h-screen bg-[#06080F] text-white antialiased flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff04 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={() => navigate('landing')}
        className="relative z-10 text-xl font-black cursor-pointer select-none tracking-tight mb-8"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Call<span className="text-blue-400">IQ</span>
      </motion.div>

      <motion.div
        variants={staggerParent()}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/60"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome back
          </h2>
          <p className="text-sm text-slate-500">Sign in to manage your business analytics</p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center w-full mb-6">
          <div className="w-full [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="relative flex py-2 items-center w-full mb-5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-widest">Or login with email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </motion.div>

        <motion.form variants={fadeUp} onSubmit={handleEmailLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 bg-[#06080F] border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <a href="#forgot" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#06080F] border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-white text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </motion.form>

        <motion.p variants={fadeUp} className="text-sm text-slate-500 mt-6 text-center">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('signup')}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none p-0 cursor-pointer inline-block"
          >
            Sign up
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;