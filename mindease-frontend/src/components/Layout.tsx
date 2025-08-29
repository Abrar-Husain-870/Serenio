import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiActivity, FiSmile, FiStar, FiSun, FiBarChart2, FiMenu, FiSettings, FiClipboard } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { Box, Flex, VStack, Button, Icon } from '@chakra-ui/react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/journal', label: 'Journal', icon: <FiBook /> },
  { to: '/mood', label: 'Mood', icon: <FiSmile /> },
  { to: '/activities', label: 'Activities', icon: <FiActivity /> },
  { to: '/progress', label: 'Progress', icon: <FiBarChart2 /> },
  { to: '/review', label: 'Review', icon: <FiClipboard /> },
  { to: '/joy-corner', label: 'JoyCorner', icon: <FiStar /> },
  { to: '/awareness', label: 'Awareness', icon: <FiSun /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings /> },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Colors adapt via _dark overrides to respect app theme

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        as="aside"
        bg="white"
        _dark={{ bg: 'gray.900', borderRightColor: 'gray.700' }}
        borderRightWidth="1px"
        borderRightColor="gray.200"
        pt={0}
        px={2}
        display="flex"
        flexDirection="column"
        gap={2}
        transition="width 200ms ease"
        w={sidebarOpen ? '14rem' : '4rem'}
        minH="100vh"
      >
        {/* Hamburger */}
        <Flex align="center" justify="flex-start" mb={1} px={2} mt={0}>
          <Button
            size="sm"
            variant="ghost"
            rounded="md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Icon as={FiMenu} boxSize={6} />
          </Button>
        </Flex>

        <VStack align="stretch" gap={1} overflowY="auto" mt={0}>
          {navLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                <Flex
                  align="center"
                  gap={3}
                  px={4}
                  py={2}
                  rounded="lg"
                  fontWeight="medium"
                  color={active ? 'gray.800' : undefined}
                  bg={active ? 'brand.100' : 'transparent'}
                  _dark={active ? { bg: 'gray.700', color: 'white' } : {}}
                  _hover={{ bg: 'gray.100', _dark: { bg: 'gray.800' } }}
                  transition="background-color 200ms ease"
                >
                  <Box as="span">{link.icon}</Box>
                  {sidebarOpen && <Box as="span">{link.label}</Box>}
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box as="main" flex="1" px={4} py={8} minH="100vh">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default Layout;