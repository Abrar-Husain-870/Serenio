import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMoodStart, addMoodSuccess, setMoods, deleteMood, addMoodFailure } from '../store/slices/moodSlice';
import { FiSmile, FiMeh, FiFrown, FiTrash2, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/api';

const MoodTracker: React.FC = () => {
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [note, setNote] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.mood);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await axiosInstance.get('/mood');
        if (Array.isArray(response.data)) {
          dispatch(setMoods(response.data));
        } else {
          throw new Error('Failed to fetch moods');
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Failed to load your mood entries');
        dispatch(addMoodFailure('Failed to load mood entries'));
      }
    };

    if (token) {
      fetchMoods();
    }
  }, [dispatch, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood || !note) {
      toast.warning('Please select a mood and add notes');
      return;
    }
    
    try {
      dispatch(addMoodStart());
      const response = await axiosInstance.post('/mood', { 
        mood, 
        note,
        notes: note,
        date: new Date().toISOString() 
      });
      
      if (response?.data) {
        dispatch(addMoodSuccess(response.data));
        setNote('');
        setMood('neutral');
        toast.success('Mood logged successfully');
        
        // Refresh mood entries
        const updatedMoods = await axiosInstance.get('/mood');
        if (Array.isArray(updatedMoods.data)) {
          dispatch(setMoods(updatedMoods.data));
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error saving mood:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save your mood entry';
      toast.error(errorMessage);
      dispatch(addMoodFailure(errorMessage));
    }
  };

  const handleDeleteMood = async (id: string) => {
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/mood/${id}`);
      dispatch(deleteMood(id));
      toast.success('Mood entry deleted');
      
      // Refresh mood entries
      const updatedMoods = await axiosInstance.get('/mood');
      if (Array.isArray(updatedMoods.data)) {
        dispatch(setMoods(updatedMoods.data));
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
      toast.error('Failed to delete mood entry');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">How are you feeling today?</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select your mood</h2>
          <div className="grid grid-cols-3 gap-6 w-fit mx-auto mb-2 place-items-center">
            <button
              type="button"
              aria-pressed={mood === 'happy'}
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center transition-colors ${
                mood === 'happy'
                  ? 'bg-green-500 text-white shadow'
                  : 'bg-gray-200 text-gray-700 dark:bg-black/40 dark:text-gray-200 border border-white/60 dark:border-white/10'
              }`}
              onClick={() => setMood('happy')}
            >
              <FiSmile className="w-7 h-7 md:w-8 md:h-8" />
              <span className="mt-1 text-sm font-medium">Happy</span>
            </button>
            <button
              type="button"
              aria-pressed={mood === 'neutral'}
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center transition-colors ${
                mood === 'neutral'
                  ? 'bg-yellow-500 text-white shadow'
                  : 'bg-gray-200 text-gray-700 dark:bg-black/40 dark:text-gray-200 border border-white/60 dark:border-white/10'
              }`}
              onClick={() => setMood('neutral')}
            >
              <FiMeh className="w-7 h-7 md:w-8 md:h-8" />
              <span className="mt-1 text-sm font-medium">Neutral</span>
            </button>
            <button
              type="button"
              aria-pressed={mood === 'sad'}
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center transition-colors ${
                mood === 'sad'
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-200 text-gray-700 dark:bg-black/40 dark:text-gray-200 border border-white/60 dark:border-white/10'
              }`}
              onClick={() => setMood('sad')}
            >
              <FiFrown className="w-7 h-7 md:w-8 md:h-8" />
              <span className="mt-1 text-sm font-medium">Sad</span>
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add a note (optional)</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input min-h-[100px]"
            placeholder="How are you feeling? What's on your mind?"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Save Mood'}
        </button>
      </form>

      {/* Mood History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Mood History</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">No mood entries yet</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const datetime = formatDateTime(entry.date);
              return (
                <div
                  key={entry.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        entry.mood === 'happy' ? 'text-green-500' :
                        entry.mood === 'neutral' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 flex items-center">
                        <FiClock className="mr-1 h-3 w-3" /> 
                        {datetime.date} at {datetime.time}
                      </span>
                      <button
                        onClick={() => handleDeleteMood(entry.id)}
                        disabled={deletingId === entry.id}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Delete mood entry"
                      >
                        {deletingId === entry.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <FiTrash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Show the note beneath the mood */}
                  {entry.note ? (
                    <div className="text-gray-700 dark:text-gray-300 text-sm mt-1 whitespace-pre-line">
                      {entry.note}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MoodTracker; 