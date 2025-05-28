import React, { useState, useEffect } from 'react';
import { FiSmile, FiPlayCircle, FiImage, FiEdit3, FiStar } from 'react-icons/fi';
import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import MemoryGame from '../components/joy/MemoryGame';
import WordJumble from '../components/joy/WordJumble';
import DrawingCanvas from '../components/joy/DrawingCanvas';
import UpliftingContentComponent from '../components/joy/UpliftingContent';
import axios from 'axios';
import { toast } from 'react-toastify';

// Emoji celebration component
const EmojiCelebration = () => {
  const [emojis, setEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    const celebrationEmojis = ['😊', '🎉', '✨', '🌟', '💖', '🎈', '🎊', '🌈', '💫', '🎁'];
    const newEmojis = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setEmojis(newEmojis);

    // Cleanup after animation
    const timer = setTimeout(() => {
      setEmojis([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {emojis.map(({ id, emoji, x, y }) => (
        <div
          key={id}
          className="absolute animate-float"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animation: `float ${1 + Math.random() * 2}s ease-out forwards`
          }}
        >
          <span className="text-2xl">{emoji}</span>
        </div>
      ))}
    </div>
  );
};

// Add this CSS to your global styles or component
const styles = `
@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}
`;

// Sub-components for different tabs
const MiniGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  // If a game is selected, render it
  if (selectedGame === 'memory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Games
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Memory Match Game</h2>
        </div>
        <MemoryGame />
      </div>
    );
  }

  if (selectedGame === 'wordjumble') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Games
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Word Jumble Game</h2>
        </div>
        <WordJumble />
      </div>
    );
  }

  // Default view - list of games
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mini Games</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Play some fun mini games to boost your mood and take a break from your day.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Memory Game Card */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="h-40 bg-gradient-to-r from-pink-500 to-purple-500 rounded-t-lg flex items-center justify-center">
            <FiPlayCircle className="text-white w-16 h-16" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Memory Match</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Test your memory by matching pairs of cards
            </p>
            <button 
              className="btn btn-primary mt-4 w-full"
              onClick={() => handleGameSelect('memory')}
            >
              Play Now
            </button>
          </div>
        </div>
        
        {/* Word Puzzle Card */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-lg flex items-center justify-center">
            <FiPlayCircle className="text-white w-16 h-16" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Word Jumble</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Unscramble the words to complete the puzzle
            </p>
            <button 
              className="btn btn-primary mt-4 w-full"
              onClick={() => handleGameSelect('wordjumble')}
            >
              Play Now
            </button>
          </div>
        </div>
        
        {/* Coming Soon Card */}
        <div className="card hover:shadow-lg transition-shadow opacity-70">
          <div className="h-40 bg-gradient-to-r from-gray-500 to-gray-600 rounded-t-lg flex items-center justify-center">
            <FiPlayCircle className="text-white w-16 h-16" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              More games are on the way!
            </p>
            <button className="btn btn-secondary mt-4 w-full" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreativeDrawing = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Creative Drawing</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Express yourself through doodling and drawing. No artistic skills required!
      </p>
      
      <DrawingCanvas />
    </div>
  );
};

const DailyChallenges = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [surprise, setSurprise] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  const handleComplete = async () => {
    try {
      setIsCompleted(true);
      await axios.post('/api/progress/update', {
        activityCompleted: true
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Challenge completed!', {
        position: 'bottom-right',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error completing challenge:', error);
      setIsCompleted(false);
      toast.error('Failed to complete challenge', {
        position: 'bottom-right',
        autoClose: 3000
      });
    }
  };

  const handleGiveJoy = () => {
    const surprises = [
      "You are stronger than you think! 💪",
      "Your smile brightens someone's day! 😊",
      "You make a difference in this world! 🌟",
      "Today is full of possibilities! ✨",
      "You are capable of amazing things! 🚀",
      "Your kindness matters! 💖",
      "You are making progress every day! 📈",
      "Your potential is limitless! 🌈",
      "You are surrounded by love! 💝",
      "Your presence is a gift! 🎁"
    ];
    
    const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
    setSurprise(randomSurprise);
    setShowSurprise(true);
    setShowCelebration(true);
    
    // Hide celebration after animation
    setTimeout(() => {
      setShowCelebration(false);
    }, 2000);
    
    toast.success('Here\'s your joy surprise!', {
      position: 'bottom-right',
      autoClose: 2000
    });
  };

  return (
    <div className="space-y-6">
      <style>{styles}</style>
      {showCelebration && <EmojiCelebration />}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Challenges</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Simple daily challenges to bring more joy into your life.
      </p>
      
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mr-4">
            <FiStar className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Challenge</h3>
            <p className="text-gray-600 dark:text-gray-400">Send a positive message to someone you appreciate</p>
          </div>
        </div>
        <button 
          className={`btn ${isCompleted ? 'btn-success' : 'btn-primary'} w-full`}
          onClick={handleComplete}
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed ✓' : 'Mark as Complete'}
        </button>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Joy Surprise</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Click the button below for a random surprise to brighten your day!
        </p>
        {showSurprise && (
          <div className="mb-4 p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white text-center text-lg font-medium animate-fade-in">
            {surprise}
          </div>
        )}
        <button 
          className="btn btn-secondary w-full"
          onClick={handleGiveJoy}
        >
          Give Me Joy
        </button>
      </div>
    </div>
  );
};

const JoyCorner: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('games');
  
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Joy Corner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the Joy Corner
          </p>
        </div>
        <div className="card text-center py-10">
          <FiSmile className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <p className="text-xl mb-6">Authentication Required</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Log in or create an account to access games, uplifting content, and creative tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="btn btn-outline w-full sm:w-auto">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary w-full sm:w-auto">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Joy Corner</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Take a break and enjoy these activities designed to bring a smile to your face
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center md:justify-start border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'games' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('games')}
        >
          <FiPlayCircle className="inline-block mr-1" />
          Mini Games
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'content' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('content')}
        >
          <FiImage className="inline-block mr-1" />
          Uplifting Content
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'drawing' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('drawing')}
        >
          <FiEdit3 className="inline-block mr-1" />
          Creative Drawing
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === 'challenges' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('challenges')}
        >
          <FiStar className="inline-block mr-1" />
          Daily Challenges
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'games' && <MiniGames />}
        {activeTab === 'content' && <UpliftingContentComponent />}
        {activeTab === 'drawing' && <CreativeDrawing />}
        {activeTab === 'challenges' && <DailyChallenges />}
      </div>
    </div>
  );
};

export default JoyCorner;