import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import { FaRegCommentDots, FaBrain, FaCalendarAlt, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import { API_BASE_URL } from '../utils/api';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { text: message, isUser: true }]);
    setMessage(''); // Clear the input immediately after sending
    setIsLoading(true);

    try {
      // Get token from Redux state
      if (!token) {
        throw new Error('Please log in to use the chatbot');
      }

      const response = await fetch(`${API_BASE_URL}/v1/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token === 'cookie' ? '' : `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'I had trouble processing your request');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        text: error instanceof Error ? error.message : 'I apologize, but I encountered an issue. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerIcsDownload = (icsContent: string) => {
    try {
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      a.download = `MindEase-Wellness-Plan-${timestamp}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download ICS file', e);
    }
  };

  // New AI feature handlers
  const handleAIFeature = async (feature: string, endpoint: string, data?: any) => {
    setIsLoading(true);
    
    try {
      if (!token) {
        throw new Error('Please log in to use this feature');
      }

      const response = await fetch(`${API_BASE_URL}/ai/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token === 'cookie' ? '' : `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(data || {})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process request');
      }

      const result = await response.json();
      
      // Format the response based on the feature
      let formattedResponse = '';
      switch (feature) {
        case 'mood-summary':
          formattedResponse = `📊 **AI Mood Summary**\n\n**Daily Summary:** ${result.dailySummary}\n\n**Weekly Trend:** ${result.weeklyTrend}\n\n**Top Triggers:**\n${result.topTriggers.map((t: string) => `• ${t}`).join('\n')}\n\n**Next Steps:**\n${result.nextSteps.map((s: string) => `• ${s}`).join('\n')}`;
          break;
        case 'cbt-thought-record':
          formattedResponse = `🧠 **CBT Thought Record**\n\n**Situation:** ${result.situation}\n**Automatic Thought:** ${result.automaticThought}\n**Emotion:** ${result.emotion}\n**Cognitive Distortion:** ${result.cognitiveDistortion}\n**Evidence:** ${result.evidence}\n**Balanced Alternative:** ${result.balancedAlternative}`;
          break;
        case 'wellness-plan':
          formattedResponse = `📅 **7-Day Wellness Plan**\n\n${(result.plan || []).map((day: any) => `**${day.day}:** ${day.title}\n${day.description}\n⏱️ ${day.timeEstimate} | 💡 ${day.whyItHelps}\n🎯 ${day.prompt}\n`).join('\n')}\n\n📱 *A calendar file is being prepared...*`;
          // Auto-download ICS calendar if present
          if (result.icsCalendar && typeof result.icsCalendar === 'string' && result.icsCalendar.trim().startsWith('BEGIN:VCALENDAR')) {
            triggerIcsDownload(result.icsCalendar);
            formattedResponse += `\n\n✅ Calendar file downloaded. Import it into Google/Outlook/Apple Calendar.`;
          } else {
            formattedResponse += `\n\nℹ️ Calendar data not available. You can regenerate the plan to try again.`;
          }
          break;
        case 'relapse-signals':
          const riskColor = result.riskLevel === 'high' ? '🔴' : result.riskLevel === 'medium' ? '🟡' : '🟢';
          formattedResponse = `${riskColor} **Relapse Risk Assessment: ${result.riskLevel.toUpperCase()}**\n\n**Signals Detected:**\n${result.signals.map((s: string) => `• ${s}`).join('\n')}\n\n**Proactive Coping Tasks:**\n${result.copingTasks.map((t: string) => `• ${t}`).join('\n')}\n\n**Check-in Schedule:**\n${result.checkInSchedule.map((c: string) => `• ${c}`).join('\n')}`;
          break;
        default:
          formattedResponse = JSON.stringify(result, null, 2);
      }

      setChatHistory(prev => [...prev, { text: formattedResponse, isUser: false }]);
    } catch (error) {
      console.error(`Error with ${feature}:`, error);
      setChatHistory(prev => [...prev, { 
        text: error instanceof Error ? error.message : 'Failed to process this feature. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gray-900 rounded-lg shadow-xl w-96 h-[500px] flex flex-col border border-gray-700">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-lg">
            <h3 className="font-semibold text-white">Chat with MindEase</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* AI Feature Quick Access Buttons */}
          <div className="p-3 border-b border-gray-700 bg-gray-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAIFeature('mood-summary', 'mood-summary')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <FaChartLine />
                <span>Mood Summary</span>
              </button>
              <button
                onClick={() => handleAIFeature('cbt-thought-record', 'cbt-thought-record', { negativeThought: 'I need help with a negative thought' })}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <FaBrain />
                <span>CBT Helper</span>
              </button>
              <button
                onClick={() => handleAIFeature('wellness-plan', 'create-plan')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <FaCalendarAlt />
                <span>Wellness Plan</span>
              </button>
              <button
                onClick={() => handleAIFeature('relapse-signals', 'relapse-signals')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
              >
                <FaExclamationTriangle />
                <span>Risk Check</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-base break-words shadow-md transition-all duration-200 ${
                    chat.isUser
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white self-end'
                      : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 self-start'
                  }`}
                  style={{ borderBottomRightRadius: chat.isUser ? 0 : '1.5rem', borderBottomLeftRadius: chat.isUser ? '1.5rem' : 0 }}
                >
                  {chat.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-center mt-2">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 rounded-2xl px-4 py-2 flex items-center shadow-md">
                  <FaRegCommentDots className="mr-2 text-xl animate-bounce" />
                  <span className="dot-flashing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-600 rounded-2xl px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;

<style>{`
.dot-flashing {
  display: flex;
  align-items: center;
}
.dot {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background: #60a5fa;
  border-radius: 50%;
  display: inline-block;
  animation: dotFlashing 1s infinite linear alternate;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes dotFlashing {
  0% { opacity: 0.2; }
  50%, 100% { opacity: 1; }
}
`}</style> 