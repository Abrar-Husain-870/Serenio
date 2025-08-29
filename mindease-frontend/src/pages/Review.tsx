import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiCheckCircle, FiActivity, FiHeart, FiSmile } from 'react-icons/fi';
import axiosInstance from '../utils/api';
import { toast } from 'react-toastify';
import { useAppSelector } from '../store/hooks';
import { Blockquote, Float } from '@chakra-ui/react';

interface MoodEntry {
  mood: string;
}

interface AnalysisData {
  overallScore: number;
  insights: string[];
  recommendations: string[];
  moodDistribution?: {
    happy: string;
    neutral: string;
    sad: string;
  };
  totalMoodEntries?: number;
}

const getSummary = (score: number) => {
  if (score >= 80) {
    return 'Excellent! You are maintaining a high level of well-being. Keep up the great work!';
  } else if (score >= 60) {
    return 'Good! Your well-being is stable, but there is still room for improvement.';
  } else if (score >= 40) {
    return 'Fair. Consider focusing on activities and habits that boost your mood and well-being.';
  } else {
    return 'Low. Take time for self-care and consider reaching out for support if needed.';
  }
};

const calculateMoodDistribution = (moodEntries: MoodEntry[]) => {
  if (!moodEntries || moodEntries.length === 0) {
    return {
      happy: '0%',
      neutral: '0%',
      sad: '0%'
    };
  }
  const counts = { happy: 0, neutral: 0, sad: 0 };
  moodEntries.forEach(entry => {
    if (entry.mood === 'happy') counts.happy++;
    else if (entry.mood === 'neutral') counts.neutral++;
    else if (entry.mood === 'sad') counts.sad++;
  });
  const total = moodEntries.length;
  return {
    happy: `${Math.round((counts.happy / total) * 100)}%`,
    neutral: `${Math.round((counts.neutral / total) * 100)}%`,
    sad: `${Math.round((counts.sad / total) * 100)}%`
  };
};

const Review: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [quote, setQuote] = useState<string>('');
  const moodEntries = useAppSelector((state) => state.mood.entries) as MoodEntry[];

  // Calculate mood distribution from mood tab data
  const moodDistribution = calculateMoodDistribution(moodEntries);
  const totalMoodEntries = moodEntries.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analysisRes, quoteRes] = await Promise.all([
          axiosInstance.get('/ai/analysis'),
          axiosInstance.get('/ai/quotes/positive')
        ]);
        setAnalysis(analysisRes.data);
        setQuote(quoteRes.data.quote);
      } catch (error) {
        console.error('Error fetching review data:', error);
        toast.error('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing your mental health data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Mental Health Review</h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered analysis of your mental well-being
        </p>
      </div>

      {/* Positive Quote Card */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Thought for Today</h2>
        </div>
        <div className="py-4">
          <Blockquote.Root variant="plain" colorPalette="teal" justify="center">
            <Float placement="top-start" offsetY="2">
              <Blockquote.Icon />
            </Float>
            <Blockquote.Content cite="https://">
              {quote}
            </Blockquote.Content>
          </Blockquote.Root>
        </div>
      </div>

      {/* Overall Score */}
      <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <h2 className="text-xl font-semibold mb-4">Overall Well-being Score</h2>
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl font-bold">{analysis?.overallScore || 0}%</div>
          <div className="mt-4 text-lg text-white/90 text-center">
            {getSummary(analysis?.overallScore || 0)}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiActivity className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Insights</h2>
        </div>
        <div className="space-y-4">
          {analysis?.insights && analysis.insights.length > 0 ? (
            analysis.insights.map((insight: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                  <FiTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{insight}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
              <p className="text-gray-500">No insights available yet</p>
              <p className="text-sm text-gray-400">Continue logging your moods, activities, and journal entries to generate personalized insights</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations (limit to 5) */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiHeart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recommendations</h2>
        </div>
        <div className="space-y-4">
          {analysis?.recommendations && analysis.recommendations.length > 0 ? (
            analysis.recommendations.slice(0, 5).map((rec: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mt-1">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">{rec}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
              <p className="text-gray-500">No recommendations available yet</p>
              <p className="text-sm text-gray-400">Track your mental health activities to receive personalized recommendations</p>
            </div>
          )}
        </div>
      </div>

      {/* Mood Distribution (from mood tab data) */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiSmile className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Mood Distribution</h2>
        </div>
        {totalMoodEntries > 0 ? (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{moodDistribution.happy}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Happy</p>
            </div>
            <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{moodDistribution.neutral}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Neutral</p>
            </div>
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{moodDistribution.sad}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sad</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
            <p className="text-gray-500">No mood data available yet</p>
            <p className="text-sm text-gray-400">Track your mood regularly to see your mood distribution</p>
          </div>
        )}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Based on your {totalMoodEntries || '0'} mood entries over the past 30 days
        </p>
      </div>
    </div>
  );
};

export default Review; 