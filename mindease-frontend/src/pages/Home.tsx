import React from 'react';
import { Link } from 'react-router-dom';
import { FiSmile, FiBookOpen, FiActivity, FiMessageCircle, FiTrendingUp, FiStar } from 'react-icons/fi';
import mindeaseLogo from '../assets/mindease-logo.svg';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: <FiSmile className="w-8 h-8 text-blue-500" />,
    title: 'Mood Tracking',
    desc: 'Track your daily moods and visualize your emotional trends over time.',
    to: '/mood',
  },
  {
    icon: <FiBookOpen className="w-8 h-8 text-blue-500" />,
    title: 'Journaling',
    desc: 'Reflect on your thoughts and feelings with secure, private journal entries.',
    to: '/journal',
  },
  {
    icon: <FiActivity className="w-8 h-8 text-blue-500" />,
    title: 'Wellbeing Activities',
    desc: 'Engage in science-backed activities to boost your mental health.',
    to: '/activities',
  },
  {
    icon: <FiMessageCircle className="w-8 h-8 text-blue-500" />,
    title: 'AI Chatbot',
    desc: 'Get instant support and insights from our AI-powered mental health assistant.',
    to: '/dashboard',
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-blue-500" />,
    title: 'Progress Tracking',
    desc: 'See your growth and celebrate your mental health milestones.',
    to: '/progress',
  },
  {
    icon: <FiStar className="w-8 h-8 text-yellow-400" />,
    title: 'Joy Corner',
    desc: 'Play games, enjoy uplifting content, and boost your mood in the Joy Corner.',
    to: '/joy-corner',
  },
];

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-blue-900 dark:to-blue-800 flex flex-col items-center justify-start px-4">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center mb-16">
        <img src={mindeaseLogo} alt="MindEase Logo" className="h-20 w-20 mb-4 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 tracking-tight">MindEase</h1>
        <p className="text-xl md:text-2xl text-blue-900 dark:text-blue-100 mb-6 font-medium max-w-2xl">
          Your all-in-one companion for mental wellness, self-reflection, and growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-primary px-8 py-3 text-lg font-semibold shadow-md">Sign In</Link>
          ) : (
            <Link to="/dashboard" className="btn btn-primary px-8 py-3 text-lg font-semibold shadow-md">Get Started</Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, idx) => (
          <Link
            to={feature.to}
            key={idx}
            className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-blue-100 dark:border-blue-900 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ textDecoration: 'none' }}
          >
            {feature.icon}
            <h3 className="mt-4 text-xl font-bold text-blue-700 dark:text-blue-200">{feature.title}</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-base">{feature.desc}</p>
          </Link>
        ))}
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-2xl mx-auto text-center mt-8">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-4">Start Your Wellness Journey Today</h2>
        <p className="text-lg text-blue-900 dark:text-blue-100 mb-8">
          Join MindEase and take the first step towards a happier, healthier you.
        </p>
        <button
          className="btn btn-primary px-10 py-3 text-lg font-semibold shadow-lg"
          onClick={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Get Started
        </button>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-3xl mx-auto mt-16 mb-12 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg p-8 border border-blue-100 dark:border-blue-900">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-4 text-center">How MindEase Works</h2>
        <ul className="text-lg text-gray-800 dark:text-gray-200 space-y-4">
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">Mood Tracking:</span> Go to the <span className="font-semibold">Mood</span> tab to log your daily mood and see your emotional trends.</li>
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">Journaling:</span> Use the <span className="font-semibold">Journal</span> tab to write and reflect on your thoughts and feelings.</li>
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">Wellbeing Activities:</span> Visit the <span className="font-semibold">Activities</span> tab for guided exercises and activities to boost your mental health.</li>
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">AI Chatbot:</span> Access the <span className="font-semibold">Dashboard</span> for instant support and insights from our AI assistant.</li>
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">Progress Tracking:</span> Check the <span className="font-semibold">Progress</span> tab to visualize your growth and celebrate milestones.</li>
          <li><span className="font-semibold text-blue-600 dark:text-blue-300">Joy Corner:</span> Head to the <span className="font-semibold">Joy Corner</span> for games, uplifting content, and mood-boosting fun.</li>
        </ul>
        <p className="mt-8 text-center text-base text-gray-600 dark:text-gray-400">Explore each tab from the sidebar to get the most out of MindEase and support your mental wellness journey!</p>
      </section>
    </div>
  );
};

export default Home; 