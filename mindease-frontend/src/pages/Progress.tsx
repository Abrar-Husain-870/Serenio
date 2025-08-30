import { useState, useEffect, useCallback } from 'react';
import { FiTrendingUp, FiAward, FiCalendar, FiChevronRight } from 'react-icons/fi';
import GlassIcons from '../reactbits components/GlassIcons';
import { BiBrain } from 'react-icons/bi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useAppSelector } from '../store/hooks';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/api';
import { useLocation } from 'react-router-dom';
import { applyCalmChartDefaults } from '../utils/chartDefaults';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Apply chart defaults once
applyCalmChartDefaults();

// Define interface for assessment history
interface AssessmentHistory {
  id: string;
  date: string;
  score: string;
  scoreLevel: 'low' | 'moderate' | 'high';
}

// Define interface for assessment questions
interface AssessmentQuestion {
  id: string;
  text: string;
}

const Progress = () => {
  const { token } = useAppSelector(state => state.auth);
  const { entries: moodEntries } = useAppSelector(state => state.mood);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    weeklyAverage: 0,
    streak: 0,
    activitiesCompleted: 0,
    moodData: {
      labels: [] as string[],
      data: [] as number[]
    },
    activityData: {
      labels: [] as string[],
      data: [] as number[]
    },
    achievements: [] as { id: string; title: string; description: string }[]
  });
  
  // Mental health assessment states
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Define the assessment questions
  const assessmentQuestions: AssessmentQuestion[] = [
    { id: 'q1', text: 'How often have you felt down, depressed, or hopeless in the past 2 weeks?' },
    { id: 'q2', text: 'How often have you had little interest or pleasure in doing things you usually enjoy?' },
    { id: 'q3', text: 'How would you rate your sleep quality over the past 2 weeks?' },
    { id: 'q4', text: 'How often have you felt nervous, anxious, or on edge?' },
    { id: 'q5', text: 'How difficult has it been to relax or control worry?' },
    { id: 'q6', text: 'How would you rate your energy levels throughout the day?' },
    { id: 'q7', text: 'How often have you had trouble concentrating on tasks?' },
    { id: 'q8', text: 'How would you rate your ability to cope with stress?' },
    { id: 'q9', text: 'How connected do you feel to friends, family, or your community?' },
    { id: 'q10', text: 'How hopeful do you feel about the future?' }
  ];

  // Process mood entries to generate chart data
  useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      // Sort entries by date
      const sortedEntries = [...moodEntries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Get up to the last 7 entries or fewer if not enough entries
      const recentEntries = sortedEntries.slice(-7);
      
      // Create arrays for labels and data
      const labels = recentEntries.map(entry => 
        new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })
      );
      
      // Convert mood to numeric value for chart
      const data = recentEntries.map(entry => {
        switch (entry.mood) {
          case 'happy': return 5;  // High value for happy
          case 'neutral': return 3; // Middle value for neutral
          case 'sad': return 1;    // Low value for sad
          default: return 0;
        }
      });
      
      // Update stats with the mood data
      setStats(prev => ({
        ...prev,
        moodData: {
          labels,
          data
        }
      }));
    }
  }, [moodEntries]);

  // Extract the fetchProgressData function so it can be reused
  const fetchProgressData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch progress stats using axiosInstance
      const response = await axiosInstance.get('/progress');

      if (response?.data) {
        // Ensure we have valid data for all fields
        const progressData = response.data;
        
        setStats(prevStats => ({
          weeklyAverage: progressData.weeklyAverage || 0,
          streak: progressData.streak || 0,
          activitiesCompleted: progressData.activitiesCompleted || 0,
          // Keep the mood data from our processing above if we have it
          moodData: prevStats.moodData.labels.length > 0 ? prevStats.moodData : {
            labels: progressData.moodData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: progressData.moodData?.data || [0, 0, 0, 0, 0, 0, 0]
          },
          activityData: {
            labels: progressData.activityData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: progressData.activityData?.data || [0, 0, 0, 0, 0, 0, 0]
          },
          achievements: progressData.achievements || []
        }));
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error fetching progress data:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load progress data';
      toast.error(errorMessage);
      
      // Keep mood data if we have it from the mood entries
      setStats(prevStats => ({
        weeklyAverage: 0,
        streak: 0,
        activitiesCompleted: 0,
        moodData: prevStats.moodData.labels.length > 0 ? prevStats.moodData : {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        activityData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        achievements: []
      }));
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch assessment history
  const fetchAssessmentHistory = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await axiosInstance.get('/ai/assessment/history');
      
      if (response?.data?.assessments) {
        setAssessmentHistory(response.data.assessments);
      } else {
        setAssessmentHistory([]);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      toast.error('Failed to load assessment history');
      setAssessmentHistory([]);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProgressData();
      fetchAssessmentHistory();
    }
  }, [token, fetchProgressData, fetchAssessmentHistory]);

  // Add this useEffect to refetch data when navigating between pages
  useEffect(() => {
    if (token) {
      fetchProgressData();
    }
  }, [location.pathname, token, fetchProgressData]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitAssessment = async () => {
    if (Object.keys(assessmentAnswers).length < assessmentQuestions.length) {
      toast.warning('Please answer all questions to get an accurate assessment');
      return;
    }
    
    setAssessmentLoading(true);
    
    try {
      const response = await axiosInstance.post('/ai/assessment/generate', {
        answers: assessmentAnswers
      });
      
      if (response?.data) {
        setAssessmentResult(response.data);
        fetchAssessmentHistory();
        setShowAssessment(false);
      } else {
        throw new Error('Failed to generate assessment');
      }
    } catch (error: any) {
      console.error('Error generating assessment:', error);
      let errorMessage = 'Failed to generate mental health assessment.';
      if (error?.response?.status === 404) {
        errorMessage = 'Assessment feature is currently unavailable. Please contact support or try again later.';
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      setAssessmentResult(null);
    } finally {
      setAssessmentLoading(false);
      setAssessmentAnswers({});
    }
  };

const resetAssessment = () => {
  setAssessmentResult(null);
  setAssessmentAnswers({});
  setShowAssessment(true);
};

// Prepare chart data from real user data
const moodData: ChartData<'line'> = {
  labels: stats.moodData.labels,
  datasets: [
    {
      label: 'Mood Level',
      data: stats.moodData.data,
      borderColor: 'rgb(59, 130, 246)', // brand-strong (blue-500/600)
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      tension: 0.35,
    },
  ],
};

const activityData: ChartData<'bar'> = {
  labels: stats.activityData.labels,
  datasets: [
    {
      label: 'Activities Completed',
      data: stats.activityData.data,
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: 'rgb(139, 92, 246)',
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const value = context.raw;
          let moodLabel = 'Unknown';
          
          if (value >= 4.5) moodLabel = 'Very Happy';
          else if (value >= 3.5) moodLabel = 'Happy';
          else if (value >= 2.5) moodLabel = 'Neutral';
          else if (value >= 1.5) moodLabel = 'Sad';
          else if (value > 0) moodLabel = 'Very Sad';
          
          return `Mood: ${moodLabel} (${value})`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: function(tickValue: number | string) {
          const value = Number(tickValue);
          switch(value) {
            case 5: return 'Very Happy';
            case 4: return 'Happy';
            case 3: return 'Neutral';
            case 2: return 'Sad';
            case 1: return 'Very Sad';
            case 0: return '';
            default: return '';
          }
        }
      },
      grid: { color: 'rgba(148, 163, 184, 0.2)' }, // muted gridlines
    },
    x: { grid: { color: 'rgba(148, 163, 184, 0.12)' } },
  },
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Glass icons items for stats overview
const glassItemsFor = (weeklyAverage: number, streak: number, activitiesCompleted: number) => ([
  { icon: <FiTrendingUp />, color: 'blue', label: `Weekly Mood Avg: ${weeklyAverage.toFixed(1)}` },
  { icon: <FiCalendar />, color: 'purple', label: `Current Streak: ${streak} days` },
  { icon: <FiAward />, color: 'green', label: `Activities Completed: ${activitiesCompleted}` },
]);

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading your progress data...</p>
    </div>
  );
}

if (!token) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <p className="text-xl mb-4">Please log in to view your progress</p>
      <p className="text-gray-600 dark:text-gray-400">Your progress data will be tracked once you log in</p>
    </div>
  );
}

return (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h1>

    {/* Mental Health Assessment Card */}
    <div className="card bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <div className="flex items-center mb-4">
        <BiBrain className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-semibold">Mental Health Status</h2>
      </div>
      <p className="mb-4">
        Take a quick assessment to understand your current mental health status and track changes over time.
      </p>

      {!showAssessment && !assessmentResult && (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <button
            onClick={() => setShowAssessment(true)}
            className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors mb-2 md:mb-0"
          >
            Start Assessment
          </button>

          {assessmentHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center text-white/90 hover:text-white underline"
            >
              {showHistory ? 'Hide history' : 'View past assessments'}
              <FiChevronRight className={`ml-1 transform transition-transform ${showHistory ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      )}

      {showHistory && (
        <div className="mt-4 bg-white/10 p-4 rounded-lg">
          <h3 className="font-medium mb-2 text-lg">Assessment History</h3>
          {assessmentHistory.length > 0 ? (
            <div className="space-y-2">
              {assessmentHistory.map((assessment) => (
                <div key={assessment.id} className="flex justify-between items-center p-2 bg-white/10 dark:bg-black/40 rounded">
                  <span>{formatDate(assessment.date)}</span>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        assessment.scoreLevel === 'high'
                          ? 'bg-green-400'
                          : assessment.scoreLevel === 'moderate'
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                      }`}
                    ></span>
                    <span>{assessment.score}/5</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/80">No assessment history available yet.</p>
          )}
        </div>
      )}

      {showAssessment && !assessmentResult && (
        <div className="mt-4">
          <div className="bg-white/10 dark:bg-black/40 p-4 rounded-lg">
            <h3 className="font-medium mb-4 text-lg">Mental Health Assessment</h3>
            <div className="space-y-4">
              {assessmentQuestions.map(question => (
                <div key={question.id} className="mb-3">
                  <label className="block mb-2">{question.text}</label>
                  <div className="flex justify-between">
                    <span className="text-xs">Not at all</span>
                    <span className="text-xs">Extremely</span>
                  </div>
                  <div className="flex justify-between space-x-2">
                    {[1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        className={`flex-1 py-2 rounded ${
                          assessmentAnswers[question.id] === value
                            ? 'bg-white text-indigo-700 font-medium'
                            : 'bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/40'
                        }`}
                        onClick={() => handleAnswerChange(question.id, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowAssessment(false)}
                className="px-4 py-2 bg-white/30 dark:bg-black/30 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssessment}
                className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                disabled={assessmentLoading}
              >
                {assessmentLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {assessmentResult && (
        <div className="mt-4">
          <div className="bg-white/10 dark:bg-black/40 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Your Results</h3>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  assessmentResult.scoreLevel === 'high'
                    ? 'bg-green-400'
                    : assessmentResult.scoreLevel === 'moderate'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                }`}></div>
                <span className="font-medium">{assessmentResult.score}/5</span>
              </div>
            </div>
            <p className="mb-4 text-white/90">{assessmentResult.analysis}</p>
            <h4 className="font-medium mb-2">Suggested Activities:</h4>
            <ul className="list-disc pl-5 mb-4 text-white/90">
              {(assessmentResult.recommendations && assessmentResult.recommendations.length > 0
                ? assessmentResult.recommendations
                : (assessmentResult.score <= 2
                    ? [
                        'Try a guided meditation session',
                        'Go for a short walk outdoors',
                        'Write down three things you are grateful for'
                      ]
                    : assessmentResult.score <= 4
                      ? [
                          'Practice deep breathing exercises',
                          'Connect with a friend or family member',
                          'Take a mindful break during your day'
                        ]
                      : [
                          'Keep up your positive habits!',
                          'Share your good mood with someone',
                          'Try a new activity for fun'
                        ]
              )
              ).map((rec: string, index: number) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
            <div className="flex justify-between">
              <button
                onClick={() => setAssessmentResult(null)}
                className="px-4 py-2 bg-white/30 dark:bg-black/30 rounded-lg hover:bg-white/40 dark:hover:bg-black/40 transition-colors"
              >
                Close
              </button>
              <button
                onClick={resetAssessment}
                className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
              >
                Take New Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Stats Overview using GlassIcons */}
    <div>
      <GlassIcons layout="side" items={glassItemsFor(stats.weeklyAverage, stats.streak, stats.activitiesCompleted)} />
    </div>

    {/* Mood Tracking */}
    <div className="card bg-white/70 dark:bg-black/50 backdrop-blur-sm border border-white/60 dark:border-white/10">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Tracking</h2>
      {stats.moodData.data.length >= 2 ? (
        <div className="h-[300px]">
          <Line data={moodData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <p className="mb-2 font-medium">Not enough data to show your mood trend yet.</p>
          <p className="text-sm">Log your mood for a couple of days to see insights and patterns.</p>
        </div>
      )}
    </div>

    {/* Activity Completion */}
    <div className="card bg-white/70 dark:bg-black/50 backdrop-blur-sm border border-white/60 dark:border-white/10">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Completion</h2>
      {stats.activityData.data.some(v => v > 0) ? (
        <div className="h-[300px]">
          <Bar data={activityData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <p className="mb-2 font-medium">No activities completed yet.</p>
          <p className="text-sm">Try one of today’s suggested activities to get started.</p>
        </div>
      )}
    </div>

    {/* Recent Achievements */}
    <div className="card bg-white/70 dark:bg-black/50 backdrop-blur-sm border border-white/60 dark:border-white/10">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
      {stats.achievements.length > 0 ? (
        <div className="space-y-4">
          {stats.achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-black/40 text-amber-600 dark:text-amber-300">
                <FiAward className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Complete more activities to earn achievements</p>
        </div>
      )}
    </div>
  </div>
);
};

export default Progress;