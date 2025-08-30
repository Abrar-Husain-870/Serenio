import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { Box, Flex, Button, Text, Avatar } from '@chakra-ui/react';
import { getRandomAvatarStyle } from '../utils/avatar';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const avatarStyle = getRandomAvatarStyle(user?.id || user?.name || 'me');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      w="full"
      shadow="softSm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex justify="space-between" align="center" h="64px" px={4}>
        {/* Left: Logo and App Name */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex align="center" gap={2} ml={0} pl={0}>
            <img
              src={mindeaseLogo}
              alt="ZenPath Logo"
              className="transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:rotate-3 hover:drop-shadow-md"
              style={{ height: 32, width: 32 }}
            />
            <Text fontSize="xl" fontWeight="bold" className="text-accent-600 dark:text-accent-400">
              ZenPath
            </Text>
          </Flex>
        </Link>
        {/* Right: Account Name and Logout */}
        <Flex align="center" gap={3} pr={4}>
          {isAuthenticated && (
            <>
              {/* Avatar using Chakra parts API */}
              <Avatar.Root
                size="sm"
                rounded="full"
                bg={avatarStyle.bgLight}
                color={avatarStyle.colorLight}
                borderWidth="2px"
                borderColor={avatarStyle.borderColorLight}
                className="[&]:bg-[color:var(--fallback-white)] dark:[&]:bg-[color:inherit]"
              >
                {/* If you later add user.avatarUrl, render Image below */}
                {/* user?.avatarUrl && (<Avatar.Image src={user.avatarUrl} alt={user.name || 'User'} />) */}
                <Avatar.Fallback fontWeight="bold">
                  {user?.name?.charAt(0) || 'A'}
                </Avatar.Fallback>
              </Avatar.Root>
              <Text className="text-gray-800 dark:text-white" fontWeight="semibold">
                {user?.name || 'Account'}
              </Text>
              <Button onClick={handleLogout} ml={2} px={3} py={1} rounded="md" bg="red.500" color="white" _hover={{ bg: 'red.600' }}>
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;