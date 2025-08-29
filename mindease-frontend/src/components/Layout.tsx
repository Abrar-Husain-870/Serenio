import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiActivity, FiSmile, FiStar, FiSun, FiBarChart2, FiMenu, FiSettings, FiClipboard } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { Box, Flex, VStack, Button, Icon } from '@chakra-ui/react';
// Backgrounds for Dashboard page (light/dark) - use static imports for reliability
import dashboardBg from '../assets/Page Backgrounds/layered-waves-haikei.png';
import dashboardBgDark from '../assets/Page Backgrounds/DashboardDark.png';

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
  const isDashboard = location.pathname === '/dashboard';
  const [isDark, setIsDark] = useState<boolean>(typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false);
  const [resolvedBg, setResolvedBg] = useState<string>(dashboardBg);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Preload backgrounds and resolve the actual URL we will use (fallback to light if dark fails)
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    const target = isDark ? dashboardBgDark : dashboardBg;
    img.onload = () => { if (!cancelled) setResolvedBg(target); };
    img.onerror = () => { if (!cancelled) setResolvedBg(dashboardBg); };
    img.src = target;
    return () => { cancelled = true; };
  }, [isDark]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Colors adapt via _dark overrides to respect app theme

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        as="aside"
        className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"
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
                  transition="background-color 200ms ease"
                  className={`${active ? 'bg-brand-100 text-gray-800 dark:bg-gray-700 dark:text-white' : 'bg-transparent'} hover:bg-gray-100 dark:hover:bg-gray-800`}
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
      <Box
        as="main"
        flex="1"
        px={isDashboard ? 0 : 4}
        py={isDashboard ? 0 : 8}
        pt={isDashboard ? 16 : undefined}
        minH="100vh"
        position={isDashboard ? 'relative' : undefined}
      >
        {isDashboard && (
          <div
            className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url(${resolvedBg})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
              backgroundColor: isDark ? '#0f172a' : '#e6f3ff',
            }}
          />
        )}
        <div className={isDashboard ? 'relative z-10' : undefined}>
          <Outlet />
        </div>
      </Box>
    </Flex>
  );
};

export default Layout;