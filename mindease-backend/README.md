# MindEase Backend

## RAG Implementation Setup

The chatbot now uses Mistral 7B via Ollama for RAG (Retrieval-Augmented Generation) capabilities. Here's how to set it up:

### Prerequisites

1. Install Ollama:
   - Visit [Ollama's website](https://ollama.ai/) and download the appropriate version for your OS
   - Follow the installation instructions

2. Pull the Mistral model:
```bash
ollama pull mistral
```

### Setup Steps

1. Install dependencies:
```bash
npm install
```

2. Initialize the vector store:
```bash
npm run init-rag
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Build and start the production server:
```bash
npm run build
npm start
```

### How It Works

1. The RAG system uses:
   - Mistral 7B via Ollama for text generation
   - FAISS for vector storage
   - LangChain for RAG implementation
   - Local .txt files for knowledge base

2. The system will:
   - First try to find relevant information from the documentation
   - Use that context to generate more accurate responses
   - Fall back to the basic chatbot if needed

### Adding New Documentation

1. Add new .txt files to the `src/rag/docs` directory
2. Run `npm run init-rag` to update the vector store

### Troubleshooting

1. If Ollama is not running:
   - Start Ollama: `ollama serve`
   - Check if it's running: `curl http://localhost:11434/api/tags`

2. If vector store initialization fails:
   - Check if the docs directory exists
   - Ensure all .txt files are properly formatted
   - Check Ollama connection

3. If the chatbot is not responding:
   - Check if Ollama is running
   - Verify the Mistral model is installed
   - Check the server logs for errors 