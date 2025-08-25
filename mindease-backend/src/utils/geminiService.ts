import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Store conversation state
const conversationState: Record<string, any> = {};

// System message template
const SYSTEM_MESSAGE = `You are a helpful mental health assistant in a wellness app called MindEase. 
You provide supportive, empathetic responses while maintaining professional boundaries.

When users want to add an activity or mood, follow these steps:

1. For Activities:
   - First ask: "What's the title of your activity?"
   - Then ask: "What type of activity is it? (e.g., exercise, meditation, reading)"
   - Then ask: "How long will it take in minutes?"
   - Finally ask: "Would you like to add a description? (optional)"
   - After getting all information, respond with: "ADD_ACTIVITY: {title}|{type}|{duration}|{description}"

2. For Moods:
   - First ask: "How are you feeling? (happy, neutral, or sad)"
   - Then ask: "Would you like to add a note about your mood? (optional)"
   - After getting all information, respond with: "ADD_MOOD: {mood}|{note}"

3. For Journal Entries:
   - First ask: "What would you like to write about?"
   - Then ask: "How are you feeling about this?"
   - After getting all information, respond with: "ADD_JOURNAL: {content}|{feeling}"

For all other queries, provide a helpful response based on your knowledge about mental health, wellness, and general support.`;

export interface ChatbotResponse {
  response: string;
  success: boolean;
}

// Function to process chatbot queries with Gemini
export async function processChatbotQueryWithGemini(query: string, userId: string): Promise<ChatbotResponse> {
  try {
    // Initialize conversation state for user if not exists
    if (!conversationState[userId]) {
      conversationState[userId] = {
        currentAction: null,
        collectedData: {}
      };
    }

    // Create the prompt with conversation state
    const prompt = `${SYSTEM_MESSAGE}

Current conversation state:
${JSON.stringify(conversationState[userId])}

User query: ${query}

Please provide a helpful response based on the conversation state and context.`;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Update conversation state based on response
    if (generatedText.includes('ADD_ACTIVITY:') || 
        generatedText.includes('ADD_MOOD:') || 
        generatedText.includes('ADD_JOURNAL:')) {
      conversationState[userId] = {
        currentAction: null,
        collectedData: {}
      };
    }

    return {
      response: generatedText.trim(),
      success: true
    };
  } catch (error) {
    console.error('Error in Gemini chatbot:', error);
    
    // Fallback to a basic response if Gemini fails
    return {
      response: "I'm here to help you navigate the MindEase app and support your mental wellness journey. How can I assist you today?",
      success: false
    };
  }
}

// Function to get positive quotes using Gemini
export async function getPositiveQuote(): Promise<string> {
  try {
    const prompt = `Generate a short, uplifting, and motivational quote about mental wellness, self-care, or personal growth. Keep it under 100 characters and make it inspiring.`;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text().trim();
  } catch (error) {
    console.error('Error getting positive quote:', error);
    
    // Fallback quotes
    const fallbackQuotes = [
      "Every day is a new beginning.",
      "You are stronger than you think.",
      "Small steps lead to big changes.",
      "Your potential is limitless.",
      "Today is your day to shine."
    ];
    
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

// New AI-powered functions

export interface MoodSummaryResponse {
  dailySummary: string;
  weeklyTrend: string;
  topTriggers: string[];
  nextSteps: string[];
  success: boolean;
}

export async function generateMoodSummary(moodData: any[], journalData: any[]): Promise<MoodSummaryResponse> {
  try {
    const prompt = `Analyze this mental health data and provide a concise, actionable summary:

Mood Data: ${JSON.stringify(moodData)}
Journal Data: ${JSON.stringify(journalData)}

Provide a structured response with:
1. Daily Summary (2-3 sentences)
2. Weekly Trend (2-3 sentences) 
3. Top 3 Triggers (bullet points)
4. 3 Next Steps (actionable, specific)

Format as JSON: {"dailySummary": "...", "weeklyTrend": "...", "topTriggers": ["...", "...", "..."], "nextSteps": ["...", "...", "..."]}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(generatedText);
      return {
        dailySummary: parsed.dailySummary || "Unable to generate summary",
        weeklyTrend: parsed.weeklyTrend || "Unable to analyze trends",
        topTriggers: parsed.topTriggers || ["Data insufficient"],
        nextSteps: parsed.nextSteps || ["Continue current routine"],
        success: true
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        dailySummary: "Your mood data shows patterns worth exploring",
        weeklyTrend: "Continue tracking to identify trends",
        topTriggers: ["Keep observing triggers"],
        nextSteps: ["Maintain current routine", "Continue journaling", "Stay consistent"],
        success: true
      };
    }
  } catch (error) {
    console.error('Error generating mood summary:', error);
    return {
      dailySummary: "Unable to generate summary at this time",
      weeklyTrend: "Data analysis temporarily unavailable",
      topTriggers: ["Continue tracking"],
      nextSteps: ["Maintain current routine"],
      success: false
    };
  }
}

export interface CBTThoughtRecordResponse {
  situation: string;
  automaticThought: string;
  emotion: string;
  cognitiveDistortion: string;
  evidence: string;
  balancedAlternative: string;
  success: boolean;
}

export async function generateCBTThoughtRecord(negativeThought: string): Promise<CBTThoughtRecordResponse> {
  try {
    const prompt = `Create a CBT thought record for this negative thought: "${negativeThought}"

Analyze and provide:
1. Situation (what happened)
2. Automatic Thought (the negative thought)
3. Emotion (0-100 intensity + emotion name)
4. Cognitive Distortion (identify the distortion type)
5. Evidence (for and against the thought)
6. Balanced Alternative (more realistic thought)

Format as JSON: {"situation": "...", "automaticThought": "...", "emotion": "...", "cognitiveDistortion": "...", "evidence": "...", "balancedAlternative": "..."}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    try {
      const parsed = JSON.parse(generatedText);
      return {
        situation: parsed.situation || "Situation unclear",
        automaticThought: parsed.automaticThought || negativeThought,
        emotion: parsed.emotion || "Emotion to be determined",
        cognitiveDistortion: parsed.cognitiveDistortion || "Pattern to identify",
        evidence: parsed.evidence || "Evidence to gather",
        balancedAlternative: parsed.balancedAlternative || "Alternative perspective to develop",
        success: true
      };
    } catch (parseError) {
      return {
        situation: "Reflect on what triggered this thought",
        automaticThought: negativeThought,
        emotion: "Rate your emotion intensity 0-100",
        cognitiveDistortion: "Identify thinking patterns",
        evidence: "Look for evidence for and against",
        balancedAlternative: "Develop a more balanced view",
        success: true
      };
    }
  } catch (error) {
    console.error('Error generating CBT thought record:', error);
    return {
      situation: "Unable to analyze at this time",
      automaticThought: negativeThought,
      emotion: "Emotion analysis unavailable",
      cognitiveDistortion: "Pattern identification needed",
      evidence: "Evidence gathering required",
      balancedAlternative: "Alternative development needed",
      success: false
    };
  }
}

export interface WellnessPlanResponse {
  plan: Array<{
    day: string;
    title: string;
    description: string;
    timeEstimate: string;
    whyItHelps: string;
    prompt: string;
  }>;
  icsCalendar: string;
  success: boolean;
}

export async function generateWellnessPlan(moodData: any[], journalData: any[]): Promise<WellnessPlanResponse> {
  try {
    const prompt = `Create a personalized 7-day wellness plan based on this data:

Mood Data: ${JSON.stringify(moodData)}
Journal Data: ${JSON.stringify(journalData)}

Generate a plan with:
- 1-2 activities per day
- Each activity includes: title, description, time estimate, why it helps, and a prompt
- Also generate an ICS calendar format for all activities

Format as JSON: {"plan": [{"day": "Day 1", "title": "...", "description": "...", "timeEstimate": "...", "whyItHelps": "...", "prompt": "..."}], "icsCalendar": "BEGIN:VCALENDAR..."}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    try {
      const parsed = JSON.parse(generatedText);
      return {
        plan: parsed.plan || [],
        icsCalendar: parsed.icsCalendar || "",
        success: true
      };
    } catch (parseError) {
      return {
        plan: [],
        icsCalendar: "",
        success: true
      };
    }
  } catch (error) {
    console.error('Error generating wellness plan:', error);
    return {
      plan: [],
      icsCalendar: "",
      success: false
    };
  }
}

export interface RelapseSignalsResponse {
  riskLevel: 'low' | 'medium' | 'high';
  signals: string[];
  copingTasks: string[];
  checkInSchedule: string[];
  success: boolean;
}

export async function detectRelapseSignals(moodData: any[], journalData: any[]): Promise<RelapseSignalsResponse> {
  try {
    const prompt = `Analyze this mental health data for relapse signals and risk indicators:

Mood Data: ${JSON.stringify(moodData)}
Journal Data: ${JSON.stringify(journalData)}

Provide:
1. Risk Level (low/medium/high)
2. 3-5 specific signals detected with brief evidence
3. 5 proactive coping tasks (90-second starters)
4. Check-in schedule for next 72 hours

Format as JSON: {"riskLevel": "low/medium/high", "signals": ["...", "..."], "copingTasks": ["...", "..."], "checkInSchedule": ["...", "..."]}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    
    try {
      const parsed = JSON.parse(generatedText);
      return {
        riskLevel: parsed.riskLevel || 'low',
        signals: parsed.signals || ["Continue monitoring"],
        copingTasks: parsed.copingTasks || ["Practice deep breathing"],
        checkInSchedule: parsed.checkInSchedule || ["Check in daily"],
        success: true
      };
    } catch (parseError) {
      return {
        riskLevel: 'low',
        signals: ["Continue monitoring patterns"],
        copingTasks: ["Practice deep breathing", "Take a short walk", "Call a friend"],
        checkInSchedule: ["Check in daily", "Monitor mood changes"],
        success: true
      };
    }
  } catch (error) {
    console.error('Error detecting relapse signals:', error);
    return {
      riskLevel: 'low',
      signals: ["Analysis temporarily unavailable"],
      copingTasks: ["Continue current routine"],
      checkInSchedule: ["Maintain regular check-ins"],
      success: false
    };
  }
}
