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

// System message template
const SYSTEM_MESSAGE = `You are a helpful mental health assistant in a wellness app called MindEase. 
You provide supportive, empathetic responses while maintaining professional boundaries.
Use the provided context if it is relevant, but you may also use your own knowledge to help the user.
If you're unsure about something, acknowledge the limitations and suggest consulting a mental health professional.`;

// Function to process chatbot queries with RAG
export async function processChatbotQueryWithRAG(query: string) {
  try {
    // Get relevant documents for the query
    const relevantDocs = await getRelevantDocuments(query);
    
    // Create the context from relevant documents
    const context = relevantDocs.join('\n\n');
    console.log('RAG context:', context);
    
    // Create the prompt with context
    let prompt;
    if (context.trim().length > 0) {
      prompt = `${SYSTEM_MESSAGE}

Context information:
${context}

User query: ${query}

If the context is relevant, use it to answer. If not, answer using your own knowledge.`;
    } else {
      prompt = `${SYSTEM_MESSAGE}

User query: ${query}

Please provide a helpful response based on your knowledge.`;
    }
    console.log('LLM prompt:', prompt);

    // Get response from the chat model
    const response = await chatModel.predict(prompt);

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