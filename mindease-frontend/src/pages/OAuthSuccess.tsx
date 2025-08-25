import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/api';

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user info with the new token
      axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          dispatch(loginSuccess({ user: response.data, token }));
          toast.success('Successfully logged in with Google!');
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          toast.error('Failed to fetch user info');
          navigate('/login', { replace: true });
        });
    } else {
      toast.error('Failed to complete Google login');
      navigate('/login', { replace: true });
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Completing login...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthSuccess; 