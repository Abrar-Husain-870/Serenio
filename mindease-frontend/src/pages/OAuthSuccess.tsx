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
    const handleOAuthSuccess = async () => {
      try {
        console.log('OAuthSuccess: Fetching user data...');
        // Get user data from the verify-token endpoint
        const response = await axiosInstance.get('/auth/verify-token');
        console.log('OAuthSuccess: Received response:', response.data);

        if (!response.data) {
          throw new Error('Failed to get user data');
        }

        // Update Redux store with user data
        console.log('OAuthSuccess: Updating Redux store...');
        dispatch(loginSuccess({
          user: response.data,
          token: 'cookie' // We don't need to store the token since it's in a cookie
        }));

        // Show success message
        toast.success('Successfully logged in with Google!');

        // Redirect to dashboard
        console.log('OAuthSuccess: Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error handling OAuth success:', error);
        toast.error('Failed to complete Google login');
        navigate('/login', { replace: true });
      }
    };

    handleOAuthSuccess();
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