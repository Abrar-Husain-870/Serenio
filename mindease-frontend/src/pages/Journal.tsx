import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addEntrySuccess, setEntries } from '../store/slices/journalSlice';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';

const Journal = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState('');
  const prompt = 'What are you grateful for today?';
  const [search, setSearch] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const dispatch = useAppDispatch();
  const { entries } = useAppSelector(state => state.journal);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // In a real app, this would fetch from the API
        // For now, let's just create some mock data
        const mockEntries = [
          {
            id: '1',
            date: new Date().toISOString(),
            content: 'Today I felt great! I went for a long walk and enjoyed the fresh air.',
            sentiment: 'positive' as const
          },
          {
            id: '2',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            content: 'Had a challenging day at work, but managed to stay focused.',
            sentiment: 'neutral' as const
          },
        ];
        
        dispatch(setEntries(mockEntries));
      } catch (error) {
        console.error('Error fetching journal entries:', error);
        toast.error('Failed to load journal entries');
      }
    };
    
    fetchEntries();
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content for your journal entry.');
      return;
    }
    
    const title = content.split(' ').slice(0, 5).join(' ') + '...';
    
    // For demo, create a mock entry
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
      sentiment: 'positive' as const
    };
    
    dispatch(addEntrySuccess(newEntry));
    toast.success('Journal entry saved successfully!');
    setContent('');
    setIsAdding(false);
  };

  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          New Entry
        </button>
      </div>
      
      {isAdding ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">New Journal Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                {prompt}
              </label>
              <textarea
                className="w-full h-36 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                type="submit" 
                className="btn btn-primary w-32"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <FiChevronLeft />
              </button>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <FiChevronRight />
              </button>
            </div>
          </div>
          
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No journal entries yet.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="btn btn-primary"
              >
                Create Your First Entry
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="mr-1" />
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className={`flex items-center ${getSentimentColor(entry.sentiment)}`}>
                      <FiCalendar className="mr-1" />
                      {entry.sentiment?.charAt(0).toUpperCase() + entry.sentiment?.slice(1) || 'Neutral'}
                    </div>
                  </div>
                  <div className="prose dark:prose-dark">
                    <p>{entry.content}</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Journal; 