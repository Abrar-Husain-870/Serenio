import { FiStar, FiAlertCircle, FiCheckCircle, FiClock, FiTarget } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addActivity, toggleActivity, setActivities } from '../store/slices/activitySlice';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';

const activitySuggestions = [
  {
    id: 1,
    title: 'Body Scan Meditation',
    description: 'A guided meditation to help you connect with your body and release tension.',
    type: 'meditation',
    duration: 10
  },
  {
    id: 2,
    title: 'Gratitude Walk',
    description: "Take a mindful walk while focusing on things you're grateful for.",
    type: 'gratitude',
    duration: 15
  },
  {
    id: 3,
    title: 'Box Breathing',
    description: 'A breathing technique to reduce stress: inhale, hold, exhale, hold, each for 4 seconds.',
    type: 'breathing',
    duration: 5
  },
  {
    id: 4,
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and then release each muscle group to achieve deep relaxation.',
    type: 'relaxation',
    duration: 15
  },
  {
    id: 5,
    title: 'Gentle Yoga',
    description: 'Simple stretches and yoga poses to improve flexibility and mindfulness.',
    type: 'exercise',
    duration: 20
  },
  {
    id: 6,
    title: 'Visualization',
    description: 'Visualize a peaceful place or successful outcome to reduce anxiety.',
    type: 'mindfulness',
    duration: 10
  }
];

const Activities: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('meditation');
  const [duration, setDuration] = useState('15');
  const [loading, setLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const dispatch = useAppDispatch();
  const { activities, streak } = useAppSelector((state) => state.activity);
  const { token } = useAppSelector(state => state.auth);

  // Filter activities by completion status
  const activeActivities = activities.filter(activity => !activity.completed);
  const completedActivities = activities.filter(activity => activity.completed);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetchWithAuth('/activities');
        
        if (response.ok) {
          const data = await response.json();
          dispatch(setActivities(data));
          
          // If there are no active activities, show completed ones
          if (data.filter((activity: any) => !activity.completed).length === 0 && 
              data.filter((activity: any) => activity.completed).length > 0) {
            setShowCompleted(true);
          }
        } else {
          throw new Error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load your activities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please log in to add activities');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetchWithAuth('/activities', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          type,
          duration,
          completed: false,
          date: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add activity');
      }
      dispatch(addActivity(data));
      toast.success('Activity added successfully!');
      setTitle('');
      setDescription('');
      setDuration('15');
    } catch (error: any) {
      toast.error('Error adding activity: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    if (!token) {
      toast.error('Please log in to track activities');
      return;
    }
    
    try {
      // Show loading toast
      const loadingToastId = toast.loading("Updating activity...");
      
      // Set a timeout to automatically dismiss the toast after 10 seconds
      const timeoutId = setTimeout(() => {
        toast.dismiss(loadingToastId);
        toast.error("Request timed out. Please try again.");
      }, 10000);
      
      try {
        // First try with PUT method since the server might be configured for PUT rather than PATCH
        let response = await fetchWithAuth(`/activities/${id}/toggle`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) // Add an empty body
        });
        
        // If PUT fails with method not allowed, try PATCH as fallback
        if (response.status === 405) {
          response = await fetchWithAuth(`/activities/${id}/toggle`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Add an empty body
          });
        }
        
        // Always dismiss the loading toast
        toast.dismiss(loadingToastId);
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Parse response data
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = {};
        }
        
        if (!response.ok) {
          throw new Error(responseData.error || `Failed to toggle activity (${response.status})`);
        }
        
        // First check how many active activities will remain
        const updatingActivity = activities.find(a => a.id.toString() === id);
        if (updatingActivity && !updatingActivity.completed) {
          // This is an active activity being marked complete
          const remainingActiveCount = activeActivities.length - 1;
          
          // Update local state
          dispatch(toggleActivity(id));
          
          // If this was the last active activity, show completed view
          if (remainingActiveCount === 0 && completedActivities.length > 0) {
            setShowCompleted(true);
          }
          
          // Update progress on the backend
          fetchWithAuth('/progress/update', {
            method: 'POST',
            body: JSON.stringify({ activityCompleted: true })
          }).catch(error => {
            console.error('Error updating progress:', error);
          });
        } else {
          // Simply update local state for other cases
          dispatch(toggleActivity(id));
        }
        
        toast.success('Activity updated!');
      } catch (error) {
        // Make sure to dismiss the loading toast and clear timeout in case of error
        toast.dismiss(loadingToastId);
        clearTimeout(timeoutId);
        throw error; // Re-throw to be caught by outer catch block
      }
    } catch (error: any) {
      console.error('Toggle activity error:', error);
      toast.error('Error updating activity: ' + (error.message || 'Unknown error'));
    }
  };

  const handleTrySuggestion = (suggestion: any) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
    setType(suggestion.type);
    setDuration(suggestion.duration.toString());
    // Scroll to the form
    document.getElementById('activity-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCompletedView = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Activities</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          <span className="font-semibold">Current Streak:</span>{' '}
          <span className="text-primary-500">{streak} days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Activity Form */}
        <div className="card" id="activity-form">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Activity</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Title</label>
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Description</label>
              <textarea
                className="input" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Type</label>
              <select
                className="input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="meditation">Meditation</option>
                <option value="exercise">Exercise</option>
                <option value="gratitude">Gratitude</option>
                <option value="breathing">Breathing</option>
                <option value="relaxation">Relaxation</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="journaling">Journaling</option>
                <option value="yoga">Yoga</option>
                <option value="stretching">Stretching</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 mb-2">Duration (minutes)</label>
              <input
                type="number"
                className="input"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Activity'}
            </button>
          </form>
        </div>

        {/* Activities List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {showCompleted ? "Completed Activities" : "Today's Activities"}
            </h2>
            <button
              onClick={toggleCompletedView}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              {showCompleted ? "Show Active" : "Show Completed"}
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : showCompleted ? (
            // Show completed activities
            completedActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                <FiCheckCircle className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500">No completed activities yet</p>
                <p className="text-sm text-gray-400">Complete some activities to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                          <FiCheckCircle className="text-green-500 mr-2" /> {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                          <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            <FiTarget className="mr-1" /> {activity.type}
                          </span>
                          <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            <FiClock className="mr-1" /> {activity.duration} min
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800/40 px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Show active activities
            activeActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                <FiAlertCircle className="w-10 h-10 text-gray-400" />
                <p className="text-gray-500">No active activities</p>
                <p className="text-sm text-gray-400">Try one of our suggested activities below</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                          <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            <FiTarget className="mr-1" /> {activity.type}
                          </span>
                          <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                            <FiClock className="mr-1" /> {activity.duration} min
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle(activity.id.toString())}
                        className="px-3 py-1 rounded flex items-center bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-green-500 hover:text-white transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Progress</h2>
          <div className="flex items-center text-primary-600 dark:text-primary-400">
            <FiStar className="mr-1" />
            <span>
              {activities.filter((a) => a.completed).length} / {activities.length} completed
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
            style={{
              width: activities.length ? `${(activities.filter((a) => a.completed).length / activities.length) * 100}%` : '0%',
            }}
          ></div>
        </div>
      </div>

      {/* Activity Suggestions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suggested Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activitySuggestions.map(suggestion => (
            <div key={suggestion.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.description}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex gap-2">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{suggestion.type}</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{suggestion.duration} min</span>
              </div>
              <button 
                onClick={() => handleTrySuggestion(suggestion)}
                className="mt-3 w-full btn btn-secondary text-sm"
              >
                Try this activity
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities; 