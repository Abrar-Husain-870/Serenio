import { useState, useEffect } from 'react';
import { FiTrendingUp, FiAward, FiCalendar, FiChevronRight } from 'react-icons/fi';
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
import { API_BASE_URL, fetchWithAuth } from '../utils/api';

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

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch progress stats using fetchWithAuth
        const response = await fetchWithAuth('/progress');

        if (!response.ok) {
          throw new Error('Failed to fetch progress data');
        }

        const data = await response.json();
        
        setStats({
          weeklyAverage: data.weeklyAverage || 0,
          streak: data.streak || 0,
          activitiesCompleted: data.activitiesCompleted || 0,
          moodData: {
            labels: data.moodData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: data.moodData?.data || [0, 0, 0, 0, 0, 0, 0]
          },
          activityData: {
            labels: data.activityData?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: data.activityData?.data || [0, 0, 0, 0, 0, 0, 0]
          },
          achievements: data.achievements || []
        });
        
        // Fetch assessment history
        fetchAssessmentHistory();
      } catch (error) {
        console.error('Error fetching progress data:', error);
        toast.error('Failed to load progress data');
        
        // Set empty default values, not demo data
        setStats({
          weeklyAverage: 0,
          streak: 0,
          activitiesCompleted: 0,
          moodData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          activityData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 0, 0]
          },
          achievements: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [token]);

  // Fetch assessment history from backend
  const fetchAssessmentHistory = async () => {
    if (!token) return;
    
    try {
      const response = await fetchWithAuth('/ai/assessment/history');
      
      if (response.ok) {
        const data = await response.json();
        setAssessmentHistory(data.assessments || []);
      } else {
        // If backend fails, set empty array, not demo data
        setAssessmentHistory([]);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      toast.error('Failed to load assessment history');
      setAssessmentHistory([]);
    }
  };

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
      const response = await fetchWithAuth('/ai/assessment/generate', {
        method: 'POST',
        body: JSON.stringify({ answers: assessmentAnswers })
      });
      
      if (response.ok) {
        const result = await response.json();
        setAssessmentResult(result);
        
        // Update assessment history
        fetchAssessmentHistory();
      } else {
        throw new Error('Failed to generate assessment');
      }
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error('Failed to generate mental health assessment');
      
      // Clear result on error
      setAssessmentResult(null);
    } finally {
      setAssessmentLoading(false);
      // Reset answers for next time
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
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4,
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
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
        
        {/* Show assessment history */}
        {showHistory && (
          <div className="mt-4 bg-white/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2 text-lg">Assessment History</h3>
            {assessmentHistory.length > 0 ? (
              <div className="space-y-2">
                {assessmentHistory.map((assessment) => (
                  <div key={assessment.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
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
        
        {/* Assessment Questions */}
        {showAssessment && !assessmentResult && (
          <div className="mt-4">
            <div className="bg-white/10 p-4 rounded-lg">
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
                              : 'bg-white/30 hover:bg-white/50'
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
                  className="px-4 py-2 bg-white/30 rounded-lg hover:bg-white/40 transition-colors"
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
        
        {/* Assessment Results */}
        {assessmentResult && (
          <div className="mt-4">
            <div className="bg-white/10 p-4 rounded-lg">
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
              
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc pl-5 mb-4 text-white/90">
                {assessmentResult.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setAssessmentResult(null)}
                  className="px-4 py-2 bg-white/30 rounded-lg hover:bg-white/40 transition-colors"
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
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Average</h2>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.weeklyAverage.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900">
              <FiAward className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Streak</h2>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {stats.streak} days
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activities Completed</h2>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.activitiesCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mood Tracking Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Tracking</h2>
        <div className="h-[300px]">
          <Line data={moodData} options={chartOptions} />
        </div>
      </div>
      
      {/* Activity Completion Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Completion</h2>
        <div className="h-[300px]">
          <Bar data={activityData} options={chartOptions} />
        </div>
      </div>
      
      {/* Achievements */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h2>
        {stats.achievements.length > 0 ? (
          <div className="space-y-4">
            {stats.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                  <span className="text-2xl">🏆</span>
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