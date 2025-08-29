import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/api';
import { Flex, Box, Heading, Spinner } from '@chakra-ui/react';

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
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box textAlign="center">
        <Heading as="h2" size="lg" color="gray.900" mb={4}>
          Completing login...
        </Heading>
        <Spinner color="accent.600" size="lg" />
      </Box>
    </Flex>
  );
};

export default OAuthSuccess;