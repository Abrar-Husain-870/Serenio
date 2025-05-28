"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAndProcessDocuments = loadAndProcessDocuments;
exports.loadVectorStore = loadVectorStore;
exports.getRelevantDocuments = getRelevantDocuments;
const ollama_1 = require("@langchain/community/embeddings/ollama");
const textsplitters_1 = require("@langchain/textsplitters");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// __filename and __dirname are available in CommonJS
// Initialize Ollama embeddings
const embeddings = new ollama_1.OllamaEmbeddings({
    baseUrl: 'http://localhost:11434', // Default Ollama URL
    model: 'mistral',
});
// Function to load and process documents
async function loadAndProcessDocuments(docsPath) {
    try {
        // Read all .txt files from the docs directory
        const files = fs.readdirSync(docsPath).filter(file => file.endsWith('.txt'));
        let allText = '';
        for (const file of files) {
            const content = fs.readFileSync(path.join(docsPath, file), 'utf-8');
            allText += content + '\n\n';
        }
        // Split text into chunks
        const textSplitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitText(allText);
        // Create and save the vector store
        const vectorStore = await faiss_1.FaissStore.fromTexts(chunks, chunks.map((_, i) => ({ id: i })), embeddings);
        // Save the vector store
        const vectorStorePath = path.join(__dirname, 'vectorstore');
        await vectorStore.save(vectorStorePath);
        return vectorStore;
    }
    catch (error) {
        console.error('Error processing documents:', error);
        throw error;
    }
}
// Function to load existing vector store
async function loadVectorStore() {
    try {
        const vectorStorePath = path.join(__dirname, 'vectorstore');
        return await faiss_1.FaissStore.load(vectorStorePath, embeddings);
    }
    catch (error) {
        console.error('Error loading vector store:', error);
        throw error;
    }
}
// Function to get relevant documents for a query
async function getRelevantDocuments(query, k = 3) {
    try {
        const vectorStore = await loadVectorStore();
        const results = await vectorStore.similaritySearch(query, k);
        return results.map((doc) => doc.pageContent);
    }
    catch (error) {
        console.error('Error getting relevant documents:', error);
        throw error;
    }
}
