"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Mock journal entries data store (replace with database in production)
let journalEntries = [];
let nextId = 1;
// Get all journal entries for the current user
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userEntries = journalEntries.filter(entry => entry.userId === userId);
        res.json(userEntries);
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
        const { title, content, mood } = req.body;
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ success: false, error: 'Please provide title and content' });
        }
        const newEntry = {
            id: nextId++,
            userId,
            title,
            content,
            mood: mood || 'neutral',
            date: req.body.date || new Date().toISOString()
        };
        journalEntries.push(newEntry);
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
        const entryId = parseInt(req.params.id);
        const initialLength = journalEntries.length;
        journalEntries = journalEntries.filter(entry => !(entry.id === entryId && entry.userId === userId));
        if (journalEntries.length === initialLength) {
            return res.status(404).json({ success: false, error: 'Journal entry not found' });
        }
        res.json({ success: true, message: 'Journal entry deleted' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
