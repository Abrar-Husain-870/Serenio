import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiActivity, FiBookOpen, FiTrendingUp, FiShield, FiArrowRight } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';

const Home: React.FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-3xl"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            Your Journey to Better Mental Health
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mb-10">
            MindEase helps you track, improve, and maintain your mental wellbeing through journaling, activities, and personalized insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg font-medium">
              Start Your Journey
            </Link>
            <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How MindEase Helps You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card hover:shadow-lg transition-shadow p-6">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-900 w-16 h-16 flex items-center justify-center mb-4">
              <FiBookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Journaling</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Express your thoughts and feelings through guided journaling. Track patterns and gain insights into your emotional state.
            </p>
          </div>
          <div className="card hover:shadow-lg transition-shadow p-6">
            <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-900 w-16 h-16 flex items-center justify-center mb-4">
              <FiActivity className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mindfulness Activities</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Guided practices to reduce stress, improve focus, and increase your overall mental wellbeing through proven techniques.
            </p>
          </div>
          <div className="card hover:shadow-lg transition-shadow p-6">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 w-16 h-16 flex items-center justify-center mb-4">
              <FiTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize your mental health journey with detailed charts and statistics that help you see improvements over time.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="card bg-gradient-to-r from-primary-500/10 to-secondary-500/10 p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Benefits of Regular Mental Wellness Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                <BiBrain className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Reduced Stress & Anxiety</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Regular mindfulness practice and journaling have been shown to significantly reduce stress levels.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                <FiHeart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Improved Emotional Regulation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Learn to identify and manage emotions more effectively through guided reflection.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                <FiShield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Better Coping Mechanisms</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Develop healthier ways to cope with life's challenges through proven mental health techniques.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                <FiTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Long-term Mental Health</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Build habits that support your mental health for sustainable well-being over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Begin Your Mental Wellness Journey Today</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Take the first step toward a healthier mind and more balanced life with MindEase.
        </p>
        <Link 
          to="/signup"
          className="btn btn-primary inline-flex items-center text-lg px-8 py-3"
        >
          Get Started <FiArrowRight className="ml-2" />
        </Link>
      </section>
    </div>
  );
};

export default Home; 