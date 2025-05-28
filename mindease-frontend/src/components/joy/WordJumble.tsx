import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiRotateCw, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Positive word list for the game
const wordList = [
  { word: 'HAPPY', hint: 'Feeling joy or pleasure' },
  { word: 'SMILE', hint: 'Expression of happiness' },
  { word: 'JOY', hint: 'Intense happiness or delight' },
  { word: 'PEACE', hint: 'Freedom from disturbance' },
  { word: 'CALM', hint: 'Not showing or feeling nervousness or excitement' },
  { word: 'BRAVE', hint: 'Ready to face danger or pain' },
  { word: 'LAUGH', hint: 'Make sounds expressing amusement' },
  { word: 'DREAM', hint: 'A series of thoughts during sleep' },
  { word: 'SHINE', hint: 'Give out a bright light' },
  { word: 'LOVE', hint: 'A strong feeling of affection' },
  { word: 'HOPE', hint: 'A feeling of expectation' },
  { word: 'KIND', hint: 'Having a friendly or generous nature' },
];

// Shuffle the letters of a word
const shuffleWord = (word: string): string => {
  let shuffled = '';
  const wordArray = word.split('');
  
  while (wordArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    shuffled += wordArray[randomIndex];
    wordArray.splice(randomIndex, 1);
  }
  
  // Ensure we don't accidentally get the same word back
  return shuffled === word ? shuffleWord(word) : shuffled;
};

const WordJumble: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [jumbledWord, setJumbledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Initialize the game
  const startGame = () => {
    // Reset state
    setScore(0);
    setTimer(0);
    setAttemptsLeft(3);
    setUserGuess('');
    setShowHint(false);
    setIsCorrect(null);
    
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Select a random word and jumble it
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const selectedWord = wordList[randomIndex];
    
    setCurrentWord(selectedWord.word);
    setJumbledWord(shuffleWord(selectedWord.word));
    setHint(selectedWord.hint);
    setGameStarted(true);
    
    // Start the timer
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Check user's guess
  const checkGuess = () => {
    if (userGuess.trim() === '') {
      toast.warning('Please enter your guess!');
      return;
    }
    
    const formattedGuess = userGuess.trim().toUpperCase();
    
    if (formattedGuess === currentWord) {
      // Correct answer
      setIsCorrect(true);
      setScore(prevScore => prevScore + 10 * attemptsLeft); // More points for fewer attempts
      
      toast.success('🎉 Correct!', {
        position: 'bottom-right',
        autoClose: 1500
      });
      
      // Move to next word after a delay
      setTimeout(() => {
        nextWord();
      }, 1500);
    } else {
      // Wrong answer
      setIsCorrect(false);
      setAttemptsLeft(prevAttempts => prevAttempts - 1);
      
      if (attemptsLeft <= 1) {
        // Game over if no attempts left
        toast.error(`The word was ${currentWord}`, {
          position: 'bottom-right',
          autoClose: 3000
        });
        
        // Move to next word after a delay
        setTimeout(() => {
          nextWord();
        }, 2000);
      } else {
        toast.error(`Incorrect! ${attemptsLeft - 1} ${attemptsLeft - 1 === 1 ? 'try' : 'tries'} left.`, {
          position: 'bottom-right',
          autoClose: 1500
        });
      }
    }
  };

  // Move to next word
  const nextWord = () => {
    setUserGuess('');
    setShowHint(false);
    setIsCorrect(null);
    setAttemptsLeft(3);
    
    // Select a new random word
    let randomIndex;
    let newWord;
    
    do {
      randomIndex = Math.floor(Math.random() * wordList.length);
      newWord = wordList[randomIndex].word;
    } while (newWord === currentWord); // Ensure we get a different word
    
    setCurrentWord(newWord);
    setJumbledWord(shuffleWord(newWord));
    setHint(wordList[randomIndex].hint);
  };

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Word Jumble</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Score:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{score}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Time:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatTime(timer)}</span>
          </div>
        </div>
      </div>
      
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FiHelpCircle className="w-16 h-16 text-primary-500 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center">
            Unscramble the jumbled words. Get points for each correct answer!
          </p>
          <button 
            className="btn btn-primary"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Jumbled Word:</span>
                <h3 className="text-3xl font-bold tracking-wider text-gray-900 dark:text-white mt-1">
                  {jumbledWord}
                </h3>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Attempts Left:</span>
                <div className="flex mt-1">
                  {[...Array(attemptsLeft)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-3 rounded-full bg-green-500 mr-1"
                    ></div>
                  ))}
                  {[...Array(3 - attemptsLeft)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            
            {showHint && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                <p className="text-yellow-700 dark:text-yellow-400">
                  <span className="font-semibold">Hint:</span> {hint}
                </p>
              </div>
            )}
            
            <div className="flex space-x-2 items-center mb-4">
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Enter your guess"
                className={`input flex-grow ${
                  isCorrect === true ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 
                  isCorrect === false ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : ''
                }`}
                maxLength={currentWord.length}
              />
              <button 
                className="btn btn-primary flex-shrink-0"
                onClick={checkGuess}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={nextWord}
              >
                Skip Word
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="btn btn-outline flex items-center"
              onClick={startGame}
            >
              <FiRotateCw className="mr-2" />
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordJumble; 