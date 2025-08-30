import React from 'react';
import { Link } from 'react-router-dom';
import { FiSmile, FiBookOpen, FiActivity, FiMessageCircle, FiTrendingUp, FiStar } from 'react-icons/fi';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { Box, Flex, Grid, Heading, Text, Button } from '@chakra-ui/react';
import GlareHover from '../reactbits components/GlareHover';
import StarBorder from '../reactbits components/StarBorder';
import SplitText from '../reactbits components/SplitText';

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
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  return (
    <Flex
      minH="100vh"
      direction="column"
      align="center"
      justify="flex-start"
      px={4}
      pt={16}
      className="bg-[radial-gradient(1200px_600px_at_80%_-10%,color-mix(in_srgb,theme(colors.blue.400)_40%,transparent),transparent)]"
    >
      {/* Hero Section */}
      <Box w="full" maxW="5xl" mx="auto" textAlign="center" mb={16}>
        <img
          src={mindeaseLogo}
          alt="ZenPath Logo"
          className="transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-3 hover:drop-shadow-lg"
          style={{ height: 80, width: 80, display: 'block', margin: '0 auto 16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
        />
        <Box as="div" w="full" mb={2}>
          <SplitText
            text="ZenPath"
            tag="h1"
            className="text-4xl md:text-6xl font-extrabold text-blue-700"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </Box>
        <Box as="div" w="full" mb={6}>
          <SplitText
            text="Your all-in-one companion for mental wellness, self-reflection, and growth."
            tag="p"
            className="text-xl md:text-2xl text-blue-900 font-medium max-w-2xl mx-auto"
            delay={80}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </Box>
        <Flex direction={{ base: 'column', sm: 'row' }} gap={4} justify="center">
          {!isAuthenticated ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button px={8} py={3} fontSize="lg" fontWeight="semibold" shadow="softMd" bg="accent.600" color="gray.900" _hover={{ bg: 'accent.500' }}>
                Sign In
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button px={8} py={3} fontSize="lg" fontWeight="semibold" shadow="softMd" bg="accent.600" color="gray.900" _dark={{ color: 'white' }} _hover={{ bg: 'accent.500' }}>
                Get Started
              </Button>
            </Link>
          )}
        </Flex>
      </Box>

      {/* Features Section */}
      <Box w="full" maxW="5xl" mx="auto" mb={20}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8} alignItems="stretch">
          {features.map((feature, idx) => (
            <Link to={feature.to} key={idx} style={{ textDecoration: 'none' }} className="block h-full">
              <GlareHover
                width="100%"
                height="100%"
                background="transparent"
                borderRadius="16px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.35}
                glareAngle={-45}
                glareSize={180}
                className="rounded-2xl overflow-hidden h-full w-full"
              >
                <StarBorder
                  as="div"
                  className="w-full h-full rounded-2xl"
                  color="#1c4ed8"
                  speed="8s"
                  thickness={0}
                  delay={`${idx * 1.5}s`}
                  contentClassName="star-border-inner-reset"
                >
                  <div className="card rounded-2xl w-full h-full transform hover:scale-105 transition-transform duration-200 text-center flex flex-col items-center bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                    {feature.icon}
                    <Heading as="h3" size="md" mt={4} className="text-blue-700">
                      {feature.title}
                    </Heading>
                    <Text mt={2} className="text-gray-600 dark:text-gray-300 text-md">
                      {feature.desc}
                    </Text>
                  </div>
                </StarBorder>
              </GlareHover>
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
          Join ZenPath and take the first step towards a happier, healthier you.
        </Text>
        <Button
          px={10}
          py={3}
          fontSize="lg"
          fontWeight="semibold"
          shadow="softLg"
          bg="accent.600"
          color="gray.900"
          _dark={{ color: 'white' }}
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
      <Box
        id="how-it-works"
        w="full"
        maxW="3xl"
        mx="auto"
        mt={16}
        mb={12}
        bg="whiteAlpha.900"
        rounded="2xl"
        shadow="softLg"
        p={8}
        borderWidth="1px"
        borderColor="blue.100"
        _dark={{ bg: 'blackAlpha.700', borderColor: 'whiteAlpha.300' }}
      >
        <Heading as="h2" size="lg" color="blue.700" _dark={{ color: 'blue.300' }} mb={4} textAlign="center">
          How ZenPath Works
        </Heading>
        <Box as="ul" fontSize="lg" color="gray.800" _dark={{ color: 'gray.200' }} style={{ listStyle: 'none', paddingLeft: 0 }}>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Mood Tracking:</Text> Go to the <Text as="span" fontWeight="semibold">Mood</Text> tab to log your daily mood and see your emotional trends.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Journaling:</Text> Use the <Text as="span" fontWeight="semibold">Journal</Text> tab to write and reflect on your thoughts and feelings.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Wellbeing Activities:</Text> Visit the <Text as="span" fontWeight="semibold">Activities</Text> tab for guided exercises and activities to boost your mental health.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">AI Chatbot:</Text> Access the <Text as="span" fontWeight="semibold">Dashboard</Text> for instant support and insights from our AI assistant.</Box>
          <Box as="li" mb={4}><Text as="span" fontWeight="semibold" color="blue.600">Progress Tracking:</Text> Check the <Text as="span" fontWeight="semibold">Progress</Text> tab to visualize your growth and celebrate milestones.</Box>
          <Box as="li" mb={0}><Text as="span" fontWeight="semibold" color="blue.600">Joy Corner:</Text> Head to the <Text as="span" fontWeight="semibold">Joy Corner</Text> for games, uplifting content, and mood-boosting fun.</Box>
        </Box>
        <Text mt={8} textAlign="center" fontSize="md" color="gray.600" _dark={{ color: 'gray.300' }}>
          Explore each tab from the sidebar to get the most out of ZenPath and support your mental wellness journey!
        </Text>
      </Box>
    </Flex>
  );
};

export default Home;