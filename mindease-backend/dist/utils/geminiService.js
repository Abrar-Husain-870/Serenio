"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChatbotQueryWithGemini = processChatbotQueryWithGemini;
exports.getPositiveQuote = getPositiveQuote;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Gemini AI
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Store conversation state
const conversationState = {};
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
// Function to process chatbot queries with Gemini
async function processChatbotQueryWithGemini(query, userId) {
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
    }
    catch (error) {
        console.error('Error in Gemini chatbot:', error);
        // Fallback to a basic response if Gemini fails
        return {
            response: "I'm here to help you navigate the MindEase app and support your mental wellness journey. How can I assist you today?",
            success: false
        };
    }
}
// Function to get positive quotes using Gemini
async function getPositiveQuote() {
    try {
        const prompt = `Generate a short, uplifting, and motivational quote about mental wellness, self-care, or personal growth. Keep it under 100 characters and make it inspiring.`;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
    catch (error) {
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
