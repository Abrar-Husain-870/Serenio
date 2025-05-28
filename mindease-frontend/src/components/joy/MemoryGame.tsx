import React, { useState, useEffect } from 'react';
import { FiSmile, FiAward, FiRotateCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// A list of positive emojis for card matching
const emojis = ['😄', '🎉', '🌟', '❤️', '🌈', '🦄', '🎵', '🎮', '🐶', '🍕', '🌺', '🚀'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Initialize the game with shuffled cards
  const initializeGame = () => {
    // Reset state
    setMatchedPairs(0);
    setMoves(0);
    setFlippedCards([]);
    setGameCompleted(false);
    setTimer(0);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Create and shuffle pairs of cards
    const selectedEmojis = emojis.slice(0, 6); // Use 6 emojis for 12 cards (6 pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]; // Duplicate for pairs
    
    // Shuffle the cards
    const shuffledCards = cardPairs
      .map((emoji, id) => ({ id, emoji, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setGameStarted(true);
    
    // Start the timer
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore if already matched or more than 2 cards flipped
    if (
      cards.find(card => card.id === id)?.isMatched ||
      flippedCards.includes(id) ||
      flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the card
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Update the cards state
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    // Check for a match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      if (firstCard?.emoji === secondCard?.emoji) {
        // It's a match!
        setMatchedPairs(prevMatched => prevMatched + 1);
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);
        
        // Check if all pairs are matched
        if (matchedPairs + 1 === emojis.slice(0, 6).length) {
          handleGameComplete();
        }
      } else {
        // Not a match, flip back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  // Handle game completion
  const handleGameComplete = () => {
    setGameCompleted(true);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    toast.success('🎉 You completed the memory game!', {
      position: 'bottom-right',
      autoClose: 3000
    });
  };

  // Format timer display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cleanup interval on unmount
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Memory Match</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Moves:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{moves}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">Time:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatTime(timer)}</span>
          </div>
        </div>
      </div>
      
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FiSmile className="w-16 h-16 text-primary-500 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center">
            Match pairs of cards to complete the game. Test your memory and have fun!
          </p>
          <button 
            className="btn btn-primary"
            onClick={initializeGame}
          >
            Start Game
          </button>
        </div>
      ) : gameCompleted ? (
        <div className="flex flex-col items-center justify-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <FiAward className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Congratulations!</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            You completed the game in {moves} moves
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400 mb-6">
            Time: {formatTime(timer)}
          </p>
          <button 
            className="btn btn-primary"
            onClick={initializeGame}
          >
            <FiRotateCw className="mr-2" />
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {cards.map(card => (
              <div
                key={card.id}
                className={`aspect-square rounded-lg flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 transform ${
                  card.isFlipped
                    ? 'bg-white dark:bg-gray-700 shadow-md rotate-y-180'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent'
                } ${card.isMatched ? 'bg-green-100 dark:bg-green-900/30 text-green-500' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button 
              className="btn btn-outline"
              onClick={initializeGame}
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame; 