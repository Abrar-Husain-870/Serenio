import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiActivity, FiHeart, FiSmile, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';

const Review: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [positiveQuote, setPositiveQuote] = useState({ quote: '', author: '' });
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    fetchAnalysis();
    fetchPositiveQuote();
  }, [token]);

  const fetchAnalysis = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // First get the user data for the review
      const userDataResponse = await fetchWithAuth('/dashboard');
      let userData = {
        avgMood: 0,
        journalCount: 0,
        activitiesCompleted: 0,
        sleepQuality: 'Unknown',
        stressLevel: 'Unknown'
      };
      
      if (userDataResponse.ok) {
        const dashboardData = await userDataResponse.json();
        userData = {
          avgMood: dashboardData.avgMood || 0,
          journalCount: dashboardData.journalCount || 0,
          activitiesCompleted: dashboardData.activitiesCompleted || 0,
          sleepQuality: dashboardData.sleepQuality || 'Unknown',
          stressLevel: dashboardData.stressLevel || 'Unknown'
        };
      }
      
      // Now try the AI-powered review endpoint with real user data
      const reviewResponse = await fetchWithAuth('/ai/review/generate', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      if (reviewResponse.ok) {
        const reviewData = await reviewResponse.json();
        
        // Calculate a score based on actual user data - default to 0 for new users
        const calculatedScore = userData.journalCount > 0 || userData.activitiesCompleted > 0 
          ? Math.round((userData.avgMood / 5) * 100) || 0
          : 0;
          
        // Format the data into our expected structure with real data
        setAnalysis({
          overallScore: calculatedScore, // Use 0% for new users with no data
          overallFeedback: reviewData.analysis || "Keep tracking your mental health to get personalized insights.",
          insights: [], // Don't use default insights
          recommendations: reviewData.recommendations?.map((rec: string, index: number) => ({
            id: index + 1,
            title: rec.split(':')[0] || rec,
            description: rec.split(':')[1] || rec
          })) || [],
          concerns: []
        });
      } else {
        // Fallback to the original endpoint if the AI endpoint fails
        const response = await fetchWithAuth('/review/analysis');
        
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        } else {
          // If backend fails, set minimal default values
          setAnalysis({
            overallScore: 0,
            overallFeedback: "Start logging your moods and activities to get personalized insights.",
            insights: [],
            recommendations: [],
            concerns: []
          });
        }
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast.error('Could not load your mental health review. Please try again later.');
      
      // Use empty values as fallback
      setAnalysis({
        overallScore: 0,
        overallFeedback: "Unable to generate your review at this time. Please try again later.",
        insights: [],
        recommendations: [],
        concerns: []
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPositiveQuote = async () => {
    setLoadingQuote(true);
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetchWithAuth(`/ai/quotes/positive?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPositiveQuote(data);
      } else {
        // Fallback quotes
        setPositiveQuote({
          quote: "The mind is like a parachute - it works best when it's open.",
          author: "Frank Zappa"
        });
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quote
      setPositiveQuote({
        quote: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
        author: "Albus Dumbledore"
      });
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleRefreshQuote = () => {
    fetchPositiveQuote();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-400">Analyzing your mental health data...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Mental Health Review</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to see your personalized mental health analysis
          </p>
        </div>
        <div className="card text-center py-10">
          <FiAlertCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <p className="text-xl mb-6">Authentication Required</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Log in or create an account to unlock personalized mental health insights based on your journal entries, mood tracking, and activities.
          </p>
        </div>
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
          <button 
            onClick={handleRefreshQuote} 
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            disabled={loadingQuote}
            aria-label="Refresh quote"
          >
            <FiRefreshCw className={`w-4 h-4 ${loadingQuote ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="py-4">
          {loadingQuote ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-2 bg-white/60 rounded w-3/4 mb-4"></div>
                <div className="h-2 bg-white/60 rounded w-1/2"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-lg italic mb-2">"{positiveQuote.quote}"</p>
              {positiveQuote.author && (
                <p className="text-sm text-white/70 text-right">— {positiveQuote.author}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Overall Score */}
      <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <h2 className="text-xl font-semibold mb-4">Overall Well-being Score</h2>
        <div className="flex items-center justify-center">
          <div className="text-6xl font-bold">{analysis?.overallScore || 0}%</div>
        </div>
        <p className="text-center mt-4 text-white/90">
          {analysis?.overallFeedback || "Start tracking your mental health to see personalized insights."}
        </p>
      </div>

      {/* Key Insights */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiActivity className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Insights</h2>
        </div>
        <div className="space-y-4">
          {analysis?.insights?.length > 0 ? (
            analysis.insights.map((insight: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900 mt-1">
                  <FiTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{insight.description}</p>
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

      {/* Recommendations */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FiHeart className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recommendations</h2>
        </div>
        <div className="space-y-4">
          {analysis?.recommendations?.length > 0 ? (
            analysis.recommendations.map((rec: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mt-1">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{rec.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{rec.description}</p>
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

      {/* Mood Distribution */}
      {analysis?.moodDistribution ? (
        <div className="card">
          <div className="flex items-center mb-4">
            <FiSmile className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Mood Distribution</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{analysis.moodDistribution.happy || '0%'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Happy</p>
            </div>
            <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{analysis.moodDistribution.neutral || '0%'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Neutral</p>
            </div>
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{analysis.moodDistribution.sad || '0%'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sad</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Based on your {analysis.totalMoodEntries || '0'} mood entries over the past 30 days
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center mb-4">
            <FiSmile className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Mood Distribution</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
            <p className="text-gray-500">No mood data available yet</p>
            <p className="text-sm text-gray-400">Track your mood regularly to see your mood distribution</p>
          </div>
        </div>
      )}

      {/* Areas of Concern - only show if there are concerns */}
      {analysis?.concerns && analysis.concerns.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Areas of Concern</h2>
          </div>
          <div className="space-y-4">
            {analysis.concerns.map((concern: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 mt-1">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{concern.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{concern.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Review; 