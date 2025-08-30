import React, { useEffect, useState } from 'react';
import { FiSmile, FiBook, FiActivity, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/api';
import SplitText from '../reactbits components/SplitText';
import SpotlightCard from '../reactbits components/SpotlightCard';

import { useAppSelector } from '../store/hooks';

interface Stats {
  currentMood: string;
  journalEntries: number;
  activities: number;
  streak: number;
  totalActivities: number;
}

const Dashboard: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const { entries } = useAppSelector((state) => state.journal);
  const [stats, setStats] = useState<Stats>({
    currentMood: 'No entries yet',
    journalEntries: 0,
    activities: 0,
    streak: 0,
    totalActivities: 0
  });
  const [loading, setLoading] = useState(true);
  const [entryCount, setEntryCount] = useState<number>(0);

  // Update stats whenever journal entries change
  useEffect(() => {
    if (entries) {
      setStats(prevStats => ({
        ...prevStats,
        journalEntries: entries.length
      }));
    }
  }, [entries]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardResponse = await axiosInstance.get('/dashboard/stats');
        setStats(dashboardResponse.data);
        // Get journal entries count - use redux store entries if available
        if (entries && Array.isArray(entries) && entries.length > 0) {
          setStats(prevStats => ({
            ...prevStats,
            journalEntries: entries.length
          }));
        } else {
          const journalResponse = await axiosInstance.get('/journal');
          if (Array.isArray(journalResponse.data)) {
            setStats(prevStats => ({
              ...prevStats,
              journalEntries: journalResponse.data.length || 0
            }));
          }
        }
        const activitiesResponse = await axiosInstance.get('/activities');
        if (Array.isArray(activitiesResponse.data)) {
          setStats(prevStats => ({
            ...prevStats,
            activities: activitiesResponse.data.filter((a: any) => a.completed).length || 0,
            totalActivities: activitiesResponse.data.length || 0
          }));
        }
        const moodResponse = await axiosInstance.get('/mood');
        if (Array.isArray(moodResponse.data)) {
          if (moodResponse.data.length > 0) {
            // Get the most recent mood
            const latestMood = moodResponse.data.sort((a: any, b: any) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
            setStats(prevStats => ({
              ...prevStats,
              currentMood: latestMood.mood
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [entries]);

  useEffect(() => {
    // Always fetch the latest journal entries from the backend for accurate count
    const fetchJournalCount = async () => {
      try {
        const response = await axiosInstance.get('/journal');
        if (Array.isArray(response.data)) {
          setEntryCount(response.data.length);
        } else {
          setEntryCount(0);
        }
      } catch {
        setEntryCount(0);
      }
    };
    fetchJournalCount();
  }, []);

  // Show authentication required message if no token
  if (!token) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to see your personal dashboard
            </p>
          </div>
          <div className="card text-center py-10">
            <FiActivity className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <p className="text-xl mb-6">Authentication Required</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Log in or create an account to track your mental health journey and access your personalized dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/login" className="btn btn-primary">Log In</Link>
              <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
        <div className="text-center mb-8">
          <SplitText
            text="Welcome to ZenPath"
            tag="h1"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
            delay={60}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="-=10000px"
            textAlign="center"
          />
          <SplitText
            text={`"The journey of a thousand miles begins with a single step. Take that step today."`}
            tag="p"
            className="text-lg text-gray-600 dark:text-gray-400 italic"
            delay={40}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="-=10000px"
            textAlign="center"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/mood" className="transition-transform duration-200 block h-full">
            <SpotlightCard className="card flex flex-col items-center text-center transform hover:scale-105 w-full h-full">
              <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-900 mb-2">
                <FiSmile className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Mood</h2>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                {loading ? 'Loading...' : stats.currentMood}
              </p>
            </SpotlightCard>
          </Link>
          <Link to="/journal" className="transition-transform duration-200 block h-full">
            <SpotlightCard className="card flex flex-col items-center text-center transform hover:scale-105 w-full h-full">
              <div className="p-4 rounded-full bg-secondary-100 dark:bg-secondary-900 mb-2">
                <FiBook className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Journal Entries</h2>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mt-1">
                {loading ? 'Loading...' : entryCount}
              </p>
            </SpotlightCard>
          </Link>
          <Link to="/activities" className="transition-transform duration-200 block h-full">
            <SpotlightCard className="card flex flex-col items-center text-center transform hover:scale-105 w-full h-full">
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                <FiActivity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h2>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {loading ? 'Loading...' : stats.activities}
              </p>
            </SpotlightCard>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/activities" className="transition-transform duration-200 block h-full">
            <SpotlightCard className="card flex flex-col justify-between transform hover:scale-105 w-full h-full">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Today's Activity</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Take a moment to practice deep breathing and mindfulness.
                </p>
              </div>
              <button className="btn btn-primary w-full mt-2">Start Activity</button>
            </SpotlightCard>
          </Link>
          <Link to="/journal" className="transition-transform duration-200 block h-full">
            <SpotlightCard className="card flex flex-col justify-between transform hover:scale-105 w-full h-full">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Journal Prompt</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  What are three things you're grateful for today?
                </p>
              </div>
              <button className="btn btn-secondary w-full mt-2">Write Now</button>
            </SpotlightCard>
          </Link>
        </div>

        {/* Progress Overview */}
        <SpotlightCard className="card transform hover:scale-105 transition-transform duration-200 w-full">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h2>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                  <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Weekly Streak</h3>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.streak} days
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900">
                  <FiCalendar className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Total Activities</h3>
                  <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                    {stats.totalActivities}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Dashboard;