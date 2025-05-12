import express from 'express';
import { 
  generatePositiveQuote, 
  generateMentalHealthReview, 
  processChatbotQuery,
  generateMentalHealthAssessment
} from '../utils/huggingfaceService';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: any) => {
  // Check if authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // In a real app, verify the token here
  // For demo purposes, we'll just check if it exists
  next();
};

// Get a positive quote
router.get('/quotes/positive', async (req, res) => {
  try {
    // Force generation of a new quote each time
    const quote = await generatePositiveQuote();
    
    // Add cache control headers to prevent browser caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json(quote);
  } catch (error) {
    console.error('Error getting positive quote:', error);
    res.status(500).json({ error: 'Failed to generate quote' });
  }
});

// Generate AI review of mental health
router.post('/review/generate', isAuthenticated, async (req, res) => {
  try {
    const userData = req.body;
    const review = await generateMentalHealthReview(userData);
    res.json(review);
  } catch (error) {
    console.error('Error generating review:', error);
    res.status(500).json({ error: 'Failed to generate review' });
  }
});

// Process chatbot query
router.post('/chatbot/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    const response = await processChatbotQuery(query);
    res.json(response);
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Generate mental health assessment
router.post('/assessment/generate', isAuthenticated, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Valid answers object is required' });
    }
    
    const assessment = await generateMentalHealthAssessment(answers);
    res.json(assessment);
  } catch (error) {
    console.error('Error generating assessment:', error);
    res.status(500).json({ error: 'Failed to generate assessment' });
  }
});

// Get user's mental health history
router.get('/assessment/history', isAuthenticated, (req, res) => {
  // In a real app, fetch from database
  // For demo, return mock data
  res.json({
    assessments: [
      {
        id: '1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        score: '3.2',
        scoreLevel: 'moderate'
      },
      {
        id: '2',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        score: '3.5',
        scoreLevel: 'moderate'
      },
      {
        id: '3',
        date: new Date().toISOString(),
        score: '3.8',
        scoreLevel: 'high'
      }
    ]
  });
});

export default router; 