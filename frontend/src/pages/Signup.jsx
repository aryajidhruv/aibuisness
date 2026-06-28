import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { env } from '../config/env.js';

const Signup = ({ navigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${env.VITE_API_BASE_URL}/api/auth/register`, formData, {
        withCredentials: true
      });
      console.log('User registered:', res.data);
      navigate('onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await axios.post(`${env.VITE_API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      }, { withCredentials: true });
      navigate('dashboard');
    } catch (error) {
      setError('Google signup failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#06080F] text-white antialiased flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff04 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Logo */}
      <div
        onClick={() => navigate('landing')}
        className="relative z-10 text-xl font-black cursor-pointer select-none tracking-tight mb-8"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        Call<span className="text-blue-400">IQ</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0D1117] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/60">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Create your account
          </h2>
          <p className="text-sm text-slate-500">Join CallIQ to automate your outreach</p>
        </div>

        {/* Google Button */}
        <div className="flex justify-center w-full mb-6">
          <div className="w-full [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google signup failed.')}
              theme="filled_black"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center w-full mb-5">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-widest">Or sign up with email</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSignup} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Dhruv Arya"
              className="w-full px-4 py-2.5 bg-[#06080F] border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full px-4 py-2.5 bg-[#06080F] border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#06080F] border border-white/10 rounded-xl text-white placeholder-slate-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-slate-500 mt-6 text-center">
          Already have an account?{' '}
          <button
            onClick={() => navigate('login')}
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none p-0 cursor-pointer inline-block"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;