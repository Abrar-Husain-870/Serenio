import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { API_BASE_URL } from '../utils/api';
import { restoreUserDataAfterLogin } from '../utils/userDataStorage';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { Flex, Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { addAlert } from '../store/slices/alertSlice';

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
      
      // Restore user data if available (unlikely for new users, but might have guest data)
      if (data.user && data.user.id) {
        restoreUserDataAfterLogin(data.user.id);
      }
      
      dispatch(addAlert({ status: 'success', title: 'Registration successful', description: 'Redirecting to dashboard...' }));
      navigate('/dashboard');
    } catch (error: any) {
      dispatch(addAlert({ status: 'error', title: 'Registration failed', description: error.message || 'Something went wrong' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Updated Google login handler
  const handleGoogleLogin = () => {
    // Clear any existing tokens before redirecting to Google OAuth
    localStorage.removeItem('token');
    localStorage.removeItem('isGoogleLogin');
    // Use the full backend URL directly for OAuth
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/google`;
  };
  
  const handleFacebookLogin = () => {
    dispatch(addAlert({ status: 'warning', title: 'Coming soon', description: 'Facebook login will be available shortly.' }));
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: 'gray.900' }} py={12} px={4}>
      <Box maxW="md" w="full" bg="white" _dark={{ bg: 'gray.800' }} rounded="2xl" shadow="softLg" p={8}>
        <Flex direction="column" align="center" mb={6}>
          <img src={mindeaseLogo} alt="MindEase Logo" style={{ height: 64, width: 64, marginBottom: 16 }} />
          <Heading as="h2" size="xl" color="gray.900" mb={2} textAlign="center">
            Create your account
          </Heading>
          <Text fontSize="sm" color="gray.600" textAlign="center">Join MindEase and start your wellness journey</Text>
        </Flex>

        <Stack gap={4}>
          <Button onClick={handleGoogleLogin} variant="outline" borderColor="gray.300" bg="white" _hover={{ bg: 'gray.100' }} disabled={isLoading}>
            <Flex align="center" gap={2} justify="center" w="full">
              <FcGoogle size={20} />
              <Text fontWeight="medium" color="gray.700">Sign up with Google</Text>
            </Flex>
          </Button>
          <Button onClick={handleFacebookLogin} bg="blue.600" _hover={{ bg: 'blue.700' }} color="white">
            <Flex align="center" gap={2} justify="center" w="full">
              <FaFacebook size={20} />
              <Text fontWeight="medium">Sign up with Facebook</Text>
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
              <label htmlFor="name" style={{ display: 'block', marginBottom: 4, fontSize: '0.875rem', fontWeight: 500, color: 'var(--chakra-colors-gray-700)' }}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </Stack>
        </Box>

        <Text fontSize="sm" textAlign="center" mt={4}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'var(--chakra-colors-accent-600)' }}>
            Already have an account? Sign in
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default SignUp;