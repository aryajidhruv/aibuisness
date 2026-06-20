import React, { useState } from 'react';

const Signup = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
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
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 🔥 CRUCIAL FIX: Pehle status check karenge, uske baad hi .json() parse hoga
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Signup failed. Please try again.');
      }

      const data = await response.json();
      console.log('User registered successfully:', data);
      
      // ✅ Custom state routing handler (Bina address-bar crash kiye component change karega)
      navigate('onboarding'); 
    } catch (err) {
      console.error("Signup Catch Block Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Port 5173 ke liye backend redirection active ho chuki hai
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-sm text-gray-500 mb-6">Join CallIQ to automate your workflows seamlessly.</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-left border border-red-200">
            {error}
          </div>
        )}

        {/* --- Email Form Inputs --- */}
        <form onSubmit={handleEmailSignup} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="dhruv"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="dhruvaryajii@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition cursor-pointer disabled:bg-blue-400"
          >
            {loading ? 'Creating Account...' : 'Sign up with Email'}
          </button>
        </form>

        {/* --- Divider --- */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* --- Google Button --- */}
        <button 
          onClick={handleGoogleSignup} 
          className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
            alt="Google Logo" 
            className="w-5 h-5 mr-3" 
          />
          Sign up with Google
        </button>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('login')} 
            className="font-semibold text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer inline-block"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;