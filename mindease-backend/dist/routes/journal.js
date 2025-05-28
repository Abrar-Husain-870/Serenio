"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const journal_1 = __importDefault(require("../models/journal"));
const router = express_1.default.Router();
// Get all journal entries for the current user
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userEntries = await journal_1.default.find({ user: userId }).sort({ createdAt: -1 });
        // Map to frontend shape
        const mappedEntries = userEntries.map(entry => ({
            id: entry._id,
            date: entry.createdAt,
            content: entry.content,
            mood: entry.mood,
            sentiment: 'neutral', // default or add logic if needed
        }));
        res.json(mappedEntries);
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Add a new journal entry
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content, mood, isShared } = req.body;
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ success: false, error: 'Please provide title and content' });
        }
        const newEntry = new journal_1.default({
            user: userId,
            content,
            mood: mood || 'neutral',
            isShared: isShared || false,
            createdAt: new Date(),
        });
        await newEntry.save();
        res.status(201).json(newEntry);
    }
    catch (error) {
        console.error('Error adding journal entry:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Delete a journal entry
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const entryId = req.params.id;
        const deleted = await journal_1.default.findOneAndDelete({ _id: entryId, user: userId });
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Journal entry not found' });
        }
        res.json({ success: true, message: 'Journal entry deleted' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Get shared journal entries
router.get('/shared', auth_1.protect, async (req, res) => {
    try {
        const sharedEntries = await journal_1.default.find({ isShared: true })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(sharedEntries);
    }
    catch (error) {
        console.error('Error fetching shared journals:', error);
        res.status(500).json({ message: 'Error fetching shared journals' });
    }
});
// Community journals endpoint
router.get('/community', async (req, res) => {
    try {
        const communityJournals = await journal_1.default.find({ isShared: true })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.json(communityJournals);
    }
    catch (error) {
        console.error('Error fetching community journals:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
