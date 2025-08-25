import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/api';
import { restoreUserDataAfterLogin } from '../utils/userDataStorage';
import mindeaseLogo from '../assets/mindease-logo.svg';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(loginStart());
    
    try {
      const { data } = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      
      if (!data.success && data.error) {
        throw new Error(data.error);
      }
      
      localStorage.removeItem('isGoogleLogin');
      
      // Ensure we have both user and token in the response
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      dispatch(loginSuccess({
        user: data.user,
        token: data.token
      }));
      
      localStorage.setItem('token', data.token);
      
      // Restore user data if available
      if (data.user && data.user.id) {
        restoreUserDataAfterLogin(data.user.id);
      }
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGoogleLogin');
    // Use the full backend URL directly for OAuth
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8">
        <div className="flex flex-col items-center">
          <img src={mindeaseLogo} alt="MindEase Logo" className="h-16 w-16 mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome to MindEase
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Sign in to your account
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition"
            disabled={isLoading}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="font-medium text-gray-700">Sign in with Google</span>
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 