import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { API_BASE_URL } from '../utils/api';
import mindeaseLogo from '../assets/mindease-logo.svg';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // This is a regular signup, not Google
      localStorage.removeItem('isGoogleLogin');
      
      dispatch(loginSuccess(data));
      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error: any) {
      toast.error('Registration error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Updated Google login handler
  const handleGoogleLogin = () => {
    // Clear any existing tokens before redirecting to Google OAuth
    localStorage.removeItem('token');
    localStorage.removeItem('isGoogleLogin');
    window.location.href = `${API_BASE_URL}/auth/google`;
  };
  
  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src={mindeaseLogo} alt="MindEase Logo" className="h-16 w-16 mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Join MindEase and start your wellness journey
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium text-gray-700">Sign up with Google</span>
          </button>
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white"
          >
            <FaFacebook className="w-5 h-5" />
            <span className="font-medium">Sign up with Facebook</span>
          </button>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 