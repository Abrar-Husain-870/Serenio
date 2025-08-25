"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const geminiService_1 = require("../utils/geminiService");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get a positive quote
router.get('/quotes/positive', async (req, res) => {
    try {
        // Force generation of a new quote each time
        const quote = await (0, geminiService_1.getPositiveQuote)();
        // Add cache control headers to prevent browser caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.json({ quote });
    }
    catch (error) {
        console.error('Error getting positive quote:', error);
        res.status(500).json({ error: 'Failed to generate quote' });
    }
});
// Process chatbot query
router.post('/chatbot/query', auth_1.protect, async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: 'User not authenticated' });
        }
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        // Use Gemini chatbot
        const response = await (0, geminiService_1.processChatbotQueryWithGemini)(query, userId);
        return res.json(response);
    }
    catch (error) {
        console.error('Error processing chatbot query:', error);
        res.status(500).json({ error: 'Failed to process query' });
    }
});
// Get user's mental health history
router.get('/assessment/history', auth_1.protect, (req, res) => {
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
exports.default = router;
