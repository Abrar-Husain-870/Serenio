import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// __filename and __dirname are available in CommonJS

// Initialize Ollama embeddings
const embeddings = new OllamaEmbeddings({
  baseUrl: 'http://localhost:11434', // Default Ollama URL
  model: 'mistral',
});

// Function to load and process documents
export async function loadAndProcessDocuments(docsPath: string) {
  try {
    // Read all .txt files from the docs directory
    const files = fs.readdirSync(docsPath).filter(file => file.endsWith('.txt'));
    
    let allText = '';
    for (const file of files) {
      const content = fs.readFileSync(path.join(docsPath, file), 'utf-8');
      allText += content + '\n\n';
    }

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.splitText(allText);

    // Create and save the vector store
    const vectorStore = await FaissStore.fromTexts(
      chunks,
      chunks.map((_: string, i: number) => ({ id: i })),
      embeddings
    );

    // Save the vector store
    const vectorStorePath = path.join(__dirname, 'vectorstore');
    await vectorStore.save(vectorStorePath);

    return vectorStore;
  } catch (error) {
    console.error('Error processing documents:', error);
    throw error;
  }
}

// Function to load existing vector store
export async function loadVectorStore() {
  try {
    const vectorStorePath = path.join(__dirname, 'vectorstore');
    return await FaissStore.load(vectorStorePath, embeddings);
  } catch (error) {
    console.error('Error loading vector store:', error);
    throw error;
  }
}

// Function to get relevant documents for a query
export async function getRelevantDocuments(query: string, k: number = 3) {
  try {
    const vectorStore = await loadVectorStore();
    const results = await vectorStore.similaritySearch(query, k);
    return results.map((doc: { pageContent: string }) => doc.pageContent);
  } catch (error) {
    console.error('Error getting relevant documents:', error);
    throw error;
  }
} 