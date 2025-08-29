import React from 'react';
import { Link } from 'react-router-dom';
import { FiSmile, FiBookOpen, FiActivity, FiMessageCircle, FiTrendingUp, FiStar } from 'react-icons/fi';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { Box, Flex, Grid, Heading, Text, Button } from '@chakra-ui/react';

const features = [
  {
    icon: <FiSmile size={32} color="#3b82f6" />,
    title: 'Mood Tracking',
    desc: 'Track your daily moods and visualize your emotional trends over time.',
    to: '/mood',
  },
  {
    icon: <FiBookOpen size={32} color="#3b82f6" />,
    title: 'Journaling',
    desc: 'Reflect on your thoughts and feelings with secure, private journal entries.',
    to: '/journal',
  },
  {
    icon: <FiActivity size={32} color="#3b82f6" />,
    title: 'Wellbeing Activities',
    desc: 'Engage in science-backed activities to boost your mental health.',
    to: '/activities',
  },
  {
    icon: <FiMessageCircle size={32} color="#3b82f6" />,
    title: 'AI Chatbot',
    desc: 'Get instant support and insights from our AI-powered mental health assistant.',
    to: '/dashboard',
  },
  {
    icon: <FiTrendingUp size={32} color="#3b82f6" />,
    title: 'Progress Tracking',
    desc: 'See your growth and celebrate your mental health milestones.',
    to: '/progress',
  },
  {
    icon: <FiStar size={32} color="#f59e0b" />,
    title: 'Joy Corner',
    desc: 'Play games, enjoy uplifting content, and boost your mood in the Joy Corner.',
    to: '/joy-corner',
  },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Flex minH="100vh" direction="column" align="center" justify="flex-start" px={4} pt={16} bgGradient="linear(to-br, blue.50, blue.100, blue.200)">
      {/* Hero Section */}
      <Box w="full" maxW="5xl" mx="auto" textAlign="center" mb={16}>
        <img
          src={mindeaseLogo}
          alt="MindEase Logo"
          style={{ height: 80, width: 80, display: 'block', margin: '0 auto 16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
        />
        <Heading as="h1" size="2xl" color="blue.700" mb={2}>
          MindEase
        </Heading>
        <Text fontSize={{ base: 'xl', md: '2xl' }} color="blue.900" mb={6} fontWeight="medium" maxW="2xl" mx="auto">
          Your all-in-one companion for mental wellness, self-reflection, and growth.
        </Text>
        <Flex direction={{ base: 'column', sm: 'row' }} gap={4} justify="center">
          {!isAuthenticated ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button px={8} py={3} fontSize="lg" fontWeight="semibold" shadow="softMd" bg="accent.600" color="gray.900" _hover={{ bg: 'accent.500' }}>
                Sign In
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button px={8} py={3} fontSize="lg" fontWeight="semibold" shadow="softMd" bg="accent.600" color="gray.900" _hover={{ bg: 'accent.500' }}>
                Get Started
              </Button>
            </Link>
          )}
        </Flex>
      </Box>

      {/* Features Section */}
      <Box w="full" maxW="5xl" mx="auto" mb={20}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {features.map((feature, idx) => (
            <Link to={feature.to} key={idx} style={{ textDecoration: 'none' }}>
              <Flex direction="column" align="center" textAlign="center" bg="whiteAlpha.800" rounded="2xl" shadow="softLg" p={8} borderWidth="1px" borderColor="blue.100" transition="transform 200ms ease" _hover={{ transform: 'scale(1.05)' }}>
                {feature.icon}
                <Heading as="h3" size="md" mt={4} color="blue.700">
                  {feature.title}
                </Heading>
                <Text mt={2} color="gray.700" fontSize="md">
                  {feature.desc}
                </Text>
              </Flex>
            </Link>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box w="full" maxW="2xl" mx="auto" textAlign="center" mt={8}>
        <Heading as="h2" size="xl" color="blue.700" mb={4}>
          Start Your Wellness Journey Today
        </Heading>
        <Text fontSize="lg" color="blue.900" mb={8}>
          Join MindEase and take the first step towards a happier, healthier you.
        </Text>
        <Button
          px={10}
          py={3}
          fontSize="lg"
          fontWeight="semibold"
          shadow="softLg"
          bg="accent.600"
          color="gray.900"
          _hover={{ bg: 'accent.500' }}
          onClick={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* How It Works Section */}
      <Box id="how-it-works" w="full" maxW="3xl" mx="auto" mt={16} mb={12} bg="whiteAlpha.900" rounded="2xl" shadow="softLg" p={8} borderWidth="1px" borderColor="blue.100">
        <Heading as="h2" size="lg" color="blue.700" mb={4} textAlign="center">
          How MindEase Works
        </Heading>
        <Box as="ul" fontSize="lg" color="gray.800" style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Mood Tracking:</Text> Go to the <Text as="span" fontWeight="semibold">Mood</Text> tab to log your daily mood and see your emotional trends.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Journaling:</Text> Use the <Text as="span" fontWeight="semibold">Journal</Text> tab to write and reflect on your thoughts and feelings.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Wellbeing Activities:</Text> Visit the <Text as="span" fontWeight="semibold">Activities</Text> tab for guided exercises and activities to boost your mental health.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">AI Chatbot:</Text> Access the <Text as="span" fontWeight="semibold">Dashboard</Text> for instant support and insights from our AI assistant.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Progress Tracking:</Text> Check the <Text as="span" fontWeight="semibold">Progress</Text> tab to visualize your growth and celebrate milestones.</Box>
          <Box as="li" mb={0}><Text as="span" fontWeight="semibold" color="blue.600">Joy Corner:</Text> Head to the <Text as="span" fontWeight="semibold">Joy Corner</Text> for games, uplifting content, and mood-boosting fun.</Box>
        </Box>
        <Text mt={8} textAlign="center" fontSize="md" color="gray.600">
          Explore each tab from the sidebar to get the most out of MindEase and support your mental wellness journey!
        </Text>
      </Box>
    </Flex>
  );
};

export default Home;