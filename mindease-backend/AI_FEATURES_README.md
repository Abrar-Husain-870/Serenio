# MindEase AI-Powered Features

This document describes the new AI-powered features added to MindEase that provide personalized mental health insights and support.

## 🚀 New AI Endpoints

All new endpoints are available under the `/ai` route and require authentication.

### 1. AI Mood Summary (`POST /ai/mood-summary`)

Generates personalized daily/weekly summaries based on your mood and journal data.

**Request:**
```json
POST /ai/mood-summary
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "dailySummary": "Today you've been feeling more positive compared to recent days...",
  "weeklyTrend": "Your mood has shown a gradual improvement over the past week...",
  "topTriggers": [
    "Work stress in the mornings",
    "Lack of sleep",
    "Social interactions"
  ],
  "nextSteps": [
    "Try morning meditation to reduce work stress",
    "Establish a consistent sleep schedule",
    "Plan one social activity this week"
  ],
  "success": true
}
```

**What it does:**
- Analyzes your mood data from the last 7 days
- Identifies patterns and trends
- Suggests actionable next steps
- Uses Gemini AI for personalized insights

### 2. CBT Thought Record Assistant (`POST /ai/cbt-thought-record`)

Creates structured Cognitive Behavioral Therapy thought records to help reframe negative thoughts.

**Request:**
```json
POST /ai/cbt-thought-record
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "negativeThought": "I'm never going to get better at this"
}
```

**Response:**
```json
{
  "situation": "Facing a challenging task at work",
  "automaticThought": "I'm never going to get better at this",
  "emotion": "Frustration (80/100)",
  "cognitiveDistortion": "Overgeneralization",
  "evidence": "You've successfully completed similar tasks before, learning takes time",
  "balancedAlternative": "This is challenging right now, but I can improve with practice and patience",
  "success": true
}
```

**What it does:**
- Analyzes negative thoughts using CBT principles
- Identifies cognitive distortions
- Suggests evidence-based alternatives
- Provides structured thought records

### 3. Wellness Plan Generator (`POST /ai/create-plan`)

Creates personalized 7-day wellness plans with calendar integration.

**Request:**
```json
POST /ai/create-plan
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "plan": [
    {
      "day": "Day 1",
      "title": "Morning Mindfulness",
      "description": "Start your day with 10 minutes of guided meditation",
      "timeEstimate": "10 minutes",
      "whyItHelps": "Sets a positive tone for the day and reduces stress",
      "prompt": "Find a quiet space and focus on your breath"
    }
  ],
  "icsCalendar": "BEGIN:VCALENDAR\nVERSION:2.0\n...",
  "success": true
}
```

**What it does:**
- Analyzes your mood and journal patterns
- Creates personalized daily activities
- Provides ICS calendar data for easy scheduling
- Explains why each activity helps

### 4. Relapse Signal Detection (`POST /ai/relapse-signals`)

Monitors your mental health patterns for early warning signs and provides proactive coping strategies.

**Request:**
```json
POST /ai/relapse-signals
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "riskLevel": "medium",
  "signals": [
    "Decreasing mood scores over the past 3 days",
    "More negative journal entries",
    "Reduced activity completion"
  ],
  "copingTasks": [
    "Practice deep breathing for 2 minutes",
    "Take a 5-minute walk outside",
    "Call a supportive friend",
    "Write down 3 things you're grateful for",
    "Try progressive muscle relaxation"
  ],
  "checkInSchedule": [
    "Check mood every 4 hours today",
    "Complete one coping task by noon",
    "Review progress before bed"
  ],
  "success": true
}
```

**What it does:**
- Analyzes patterns in your data for risk indicators
- Provides risk level assessment (low/medium/high)
- Suggests immediate coping strategies
- Creates check-in schedules

## 🔧 Technical Implementation

### Backend Changes
- **New functions** in `src/utils/geminiService.ts`
- **New endpoints** in `src/routes/ai.ts`
- **Enhanced prompts** for structured AI responses
- **Error handling** with fallback responses

### Frontend Changes
- **Quick-access buttons** in the Chatbot component
- **Formatted responses** for each AI feature
- **Loading states** and error handling
- **Responsive design** for mobile and desktop

### AI Integration
- Uses **Google Gemini 1.5 Flash** model
- **Structured prompts** for consistent responses
- **JSON parsing** with fallback handling
- **Context-aware** analysis based on user data

## 🚦 Usage Instructions

### For Users
1. **Open the Chatbot** (bottom-right corner)
2. **Click any AI feature button**:
   - 📊 **Mood Summary** - Get daily/weekly insights
   - 🧠 **CBT Helper** - Reframe negative thoughts
   - 📅 **Wellness Plan** - Create 7-day plans
   - ⚠️ **Risk Check** - Monitor for warning signs
3. **View formatted responses** with actionable insights
4. **Use the regular chat** for other questions

### For Developers
1. **Ensure `GEMINI_API_KEY`** is set in environment
2. **Test endpoints** using the provided test script
3. **Monitor API responses** for structured data
4. **Handle errors gracefully** with fallback content

## 🔒 Privacy & Security

- **All endpoints require authentication**
- **User data is isolated** by user ID
- **AI analysis uses only your own data**
- **No data is stored** by external AI services
- **Responses are generated** in real-time

## 🧪 Testing

Use the provided test script:
```bash
cd mindease-backend
node test-ai-endpoints.js
```

**Note:** Protected endpoints require valid JWT tokens and user data in the database.

## 🚀 Future Enhancements

- **Offline mode** for AI features
- **Customizable prompts** based on user preferences
- **Integration with external calendars** (Google, Outlook)
- **Advanced pattern recognition** for better insights
- **Multi-language support** for global users

## 📞 Support

If you encounter issues:
1. Check that `GEMINI_API_KEY` is properly set
2. Verify your backend is running and accessible
3. Ensure you have mood/journal data for analysis
4. Check the browser console for error messages

---

**Built with ❤️ for better mental health support**
