import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi there! I'm your MindEase assistant. I can help you navigate the app, suggest activities, or answer questions about mental wellness. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetchWithAuth('/ai/chatbot/query', {
        method: 'POST',
        body: JSON.stringify({ query: currentMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Enhanced contextual fallback responses based on user's message
      const userMessageLower = currentMessage.toLowerCase();
      let fallbackResponse = "I'm sorry, I couldn't process your request. How else can I help you?";
      
      // Help with app navigation
      if (userMessageLower.includes('help') || userMessageLower.includes('guide') || userMessageLower.includes('how to')) {
        if (userMessageLower.includes('journal') || userMessageLower.includes('write')) {
          fallbackResponse = "To use the journal feature, go to the Journal tab in the sidebar. Click on 'New Entry' to start writing. Your entries are saved automatically and can help track your thoughts and feelings over time.";
        } else if (userMessageLower.includes('mood') || userMessageLower.includes('emotion') || userMessageLower.includes('feeling')) {
          fallbackResponse = "You can track your mood in the Mood section. Select how you're feeling on a scale, add notes about what's influencing your mood, and track patterns over time to understand what affects your emotional wellbeing.";
        } else if (userMessageLower.includes('activit')) {
          fallbackResponse = "The Activities section provides self-care exercises and mindfulness practices. You can mark activities as complete to track your progress. Try to complete at least one activity daily for best results.";
        } else if (userMessageLower.includes('progress') || userMessageLower.includes('track') || userMessageLower.includes('improve')) {
          fallbackResponse = "The Progress section shows your mental health trends and achievements. You can also take assessments to get personalized recommendations. Regular check-ins will provide more accurate insights.";
        } else {
          fallbackResponse = "MindEase helps you track and improve your mental wellbeing. Use the sidebar to navigate between: Journal (record thoughts), Mood (track emotions), Activities (self-care exercises), Progress (see improvements), and Awareness (learn about mental health).";
        }
      }
      // Mental health concerns
      else if (userMessageLower.includes('depress') || userMessageLower.includes('sad') || userMessageLower.includes('down')) {
        fallbackResponse = "I'm sorry you're feeling down. Consider trying a gratitude journaling exercise in the Journal section, or a mood-lifting activity like a nature walk or connecting with a friend. Regular exercise and mindfulness can also help with depressive feelings. If these feelings persist, please consider speaking with a mental health professional.";
      }
      else if (userMessageLower.includes('anxious') || userMessageLower.includes('anxiety') || userMessageLower.includes('stress') || userMessageLower.includes('worried')) {
        fallbackResponse = "For anxiety, try the deep breathing exercises in the Activities section. The 4-7-8 technique can be helpful: breathe in for 4 seconds, hold for 7, and exhale for 8. Progressive muscle relaxation is also effective for physical tension. Journaling about specific worries can help put them in perspective.";
      }
      else if (userMessageLower.includes('sleep') || userMessageLower.includes('insomnia') || userMessageLower.includes('tired')) {
        fallbackResponse = "Sleep problems are common with mental health challenges. Try creating a regular sleep schedule, avoid screens before bed, and consider a relaxation activity from the Activities section before sleeping. The 'Body Scan Meditation' can be particularly helpful for sleep.";
      }
      // App features
      else if (userMessageLower.includes('feature') || userMessageLower.includes('can you do')) {
        fallbackResponse = "MindEase offers: 1) Mood tracking to identify emotional patterns, 2) Journaling for self-reflection, 3) Activities with evidence-based exercises for mental wellness, 4) Progress tracking to visualize your journey, 5) Mental health assessments, and 6) Resources in the Awareness section about various mental health topics.";
      }
      // Specific recommendations
      else if (userMessageLower.includes('recommend') || userMessageLower.includes('suggest') || userMessageLower.includes('what should i do')) {
        if (userMessageLower.includes('now') || userMessageLower.includes('today')) {
          fallbackResponse = "Based on what many users find helpful, I'd recommend checking in with your mood in the Mood section, then trying the 'Progressive Muscle Relaxation' activity or a short gratitude journaling session. These quick exercises can provide immediate relief and grounding.";
        } else {
          fallbackResponse = "I recommend establishing a daily mental wellness routine: 1) Track your mood each morning, 2) Complete at least one activity from the suggested list, 3) Journal for 5-10 minutes about your thoughts and feelings, and 4) Review your progress weekly to celebrate improvements.";
        }
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      toast.error('Connection issue with the chatbot. Using offline responses.', { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Suggestion chips that users can click on
  const suggestions = [
    "How do I use this app?",
    "I'm feeling anxious",
    "Recommend an activity",
    "What features are available?"
  ];
  
  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    
    // Small delay to show the suggestion was selected before sending
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg z-20 transition-all duration-300"
        aria-label="Open chat assistant"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-6 bottom-24 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col ${
            isMinimized ? 'w-64 h-14' : 'w-80 sm:w-96 h-[500px]'
          }`}
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiMessageCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="font-semibold text-gray-800 dark:text-white">MindEase Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMinimize}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close chat"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <p>{message.text}</p>
                        <span className={`text-xs mt-1 block ${
                          message.sender === 'user'
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-[80%]">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Suggestion Chips */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm rounded-full px-3 py-1 whitespace-nowrap"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-l-lg focus:outline-none text-gray-800 dark:text-white"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-r-lg ${
                      isLoading || !currentMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading || !currentMessage.trim()}
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot; 