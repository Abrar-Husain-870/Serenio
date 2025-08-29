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
      bg="white"
      _dark={{ bg: 'gray.800', borderBottomColor: 'gray.700' }}
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      w="full"
      shadow="softSm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex justify="space-between" align="center" h="64px" px={0}>
        {/* Left: Logo and App Name */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex align="center" gap={2} ml={0} pl={0}>
            <img src={mindeaseLogo} alt="MindEase Logo" style={{ height: 32, width: 32 }} />
            <Text fontSize="xl" fontWeight="bold" color="accent.600" _dark={{ color: 'accent.400' }}>
              MindEase
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
                _dark={{ bg: avatarStyle.bgDark, color: avatarStyle.colorDark, borderColor: avatarStyle.borderColorDark }}
              >
                {/* If you later add user.avatarUrl, render Image below */}
                {/* user?.avatarUrl && (<Avatar.Image src={user.avatarUrl} alt={user.name || 'User'} />) */}
                <Avatar.Fallback fontWeight="bold">
                  {user?.name?.charAt(0) || 'A'}
                </Avatar.Fallback>
              </Avatar.Root>
              <Text color="gray.800" _dark={{ color: 'white' }} fontWeight="semibold">{user?.name || 'Account'}</Text>
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