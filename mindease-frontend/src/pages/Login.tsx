import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import axiosInstance from '../utils/api';
import { restoreUserDataAfterLogin } from '../utils/userDataStorage';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { Flex, Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { addAlert } from '../store/slices/alertSlice';

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
      
      dispatch(addAlert({ status: 'success', title: 'Login successful', description: 'Redirecting to dashboard...' }));
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      dispatch(addAlert({ status: 'error', title: 'Login failed', description: errorMessage }));
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
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: 'gray.900' }} py={12} px={4}>
      <Box maxW="md" w="full" bg="white" _dark={{ bg: 'gray.800' }} rounded="2xl" shadow="softLg" p={8}>
        <Flex direction="column" align="center" mb={6}>
          <img src={mindeaseLogo} alt="MindEase Logo" style={{ height: 64, width: 64, marginBottom: 16 }} />
          <Heading as="h2" size="xl" color="gray.900" mb={2} textAlign="center">
            Welcome to MindEase
          </Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">Sign in to your account</Text>
        </Flex>

        <Stack gap={4}>
          <Button onClick={handleGoogleLogin} variant="outline" borderColor="gray.300" bg="white" _hover={{ bg: 'gray.100' }} disabled={isLoading}>
            <Flex align="center" gap={2} justify="center" w="full">
              <FcGoogle size={20} />
              <Text fontWeight="medium" color="gray.700">Sign in with Google</Text>
            </Flex>
          </Button>
        </Stack>

        <Flex align="center" my={4} w="full">
          <Box flexGrow={1} h="1px" bg="gray.300" />
          <Text mx={2} color="gray.400">or</Text>
          <Box flexGrow={1} h="1px" bg="gray.300" />
        </Flex>

        <Box as="form" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Box>
              <label htmlFor="email" style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--chakra-colors-gray-700)' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--chakra-colors-gray-300)'
                }}
              />
            </Box>
            <Box>
              <label htmlFor="password" style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--chakra-colors-gray-700)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--chakra-colors-gray-300)'
                }}
              />
            </Box>
            <Button type="submit" w="full" mt={2} bg="accent.600" color="gray.900" _hover={{ bg: 'accent.500' }} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </Box>

        <Text fontSize="sm" textAlign="center" mt={4}>
          <Link to="/signup" style={{ textDecoration: 'none', color: 'var(--chakra-colors-accent-600)' }}>
            Don't have an account? Sign up
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;