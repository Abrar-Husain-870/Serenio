import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { getRelevantDocuments } from './embeddings';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the chat model with Mistral 7B
const chatModel = new ChatOllama({
  baseUrl: 'http://localhost:11434', // Default Ollama URL
  model: 'llama3',
  temperature: 0.7,
});

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

For all other queries, provide a helpful response based on the context or your knowledge.`;

// Function to process chatbot queries with RAG
export async function processChatbotQueryWithRAG(query: string, userId: string) {
  try {
    // Initialize conversation state for user if not exists
    if (!conversationState[userId]) {
      conversationState[userId] = {
        currentAction: null,
        collectedData: {}
      };
    }

    // Get relevant documents for the query
    const relevantDocs = await getRelevantDocuments(query);
    
    // Create the context from relevant documents
    const context = relevantDocs.join('\n\n');
    
    // Create the prompt with context and conversation state
    let prompt = `${SYSTEM_MESSAGE}

Current conversation state:
${JSON.stringify(conversationState[userId])}

Context information:
${context}

User query: ${query}

Please provide a helpful response based on the conversation state and context.`;

    // Get response from the chat model
    const response = await chatModel.predict(prompt);

    // Update conversation state based on response
    if (response.includes('ADD_ACTIVITY:') || response.includes('ADD_MOOD:') || response.includes('ADD_JOURNAL:')) {
      conversationState[userId] = {
        currentAction: null,
        collectedData: {}
      };
    }

    return {
      response: response.trim()
    };
  } catch (error) {
    console.error('Error in RAG chatbot:', error);
    
    // Fallback to a basic response if RAG fails
    return {
      response: "I'm here to help you navigate the MindEase app and support your mental wellness journey. How can I assist you today?"
    };
  }
} 