import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMoodStart, addMoodSuccess, setMoods } from '../store/slices/moodSlice';
import { FiSmile, FiMeh, FiFrown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';

const MoodTracker: React.FC = () => {
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [note, setNote] = useState('');
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.mood);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetchWithAuth('/moods');
        
        if (response.ok) {
          const data = await response.json();
          dispatch(setMoods(data));
        } else {
          throw new Error('Failed to fetch moods');
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Failed to load your mood entries');
      }
    };

    fetchMoods();
  }, [dispatch, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood || !note) {
      toast.warning('Please select a mood and add notes');
      return;
    }
    
    try {
      dispatch(addMoodStart());
      const response = await fetchWithAuth('/moods', {
        method: 'POST',
        body: JSON.stringify({ mood, note, date: new Date().toISOString() })
      });
      
      if (response.ok) {
        const data = await response.json();
        dispatch(addMoodSuccess(data));
        setNote('');
        toast.success('Mood logged successfully');
      } else {
        throw new Error('Failed to save mood');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save your mood entry');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">How are you feeling today?</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select your mood</h2>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              className={`btn flex-1 py-2 px-4 rounded ${
                mood === 'happy'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setMood('happy')}
            >
              <FiSmile className="inline-block mr-2" />
              Happy
            </button>
            <button
              type="button"
              className={`btn flex-1 py-2 px-4 rounded ${
                mood === 'neutral'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setMood('neutral')}
            >
              <FiMeh className="inline-block mr-2" />
              Neutral
            </button>
            <button
              type="button"
              className={`btn flex-1 py-2 px-4 rounded ${
                mood === 'sad'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setMood('sad')}
            >
              <FiFrown className="inline-block mr-2" />
              Sad
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
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{entry.mood}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                {entry.note && <p className="text-gray-600">{entry.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker; 