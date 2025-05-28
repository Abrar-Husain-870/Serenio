import { loadAndProcessDocuments } from './embeddings';
import * as path from 'path';

// Path to the documents directory
const docsPath = path.join(__dirname, '..', '..', 'docs');

// Initialize RAG
async function initRAG() {
  try {
    console.log('Initializing RAG system...');
    await loadAndProcessDocuments(docsPath);
    console.log('RAG system initialized successfully!');
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    process.exit(1);
  }
}

initRAG(); 