"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProgress = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Mock moods data store (replace with database in production)
let moods = [];
let nextId = 1;
// Import or define reference to user progress (in-memory for this demo)
// This should match the structure used in progress.ts
exports.userProgress = {};
// Function to update mood data in progress
const updateMoodDataInProgress = (userId) => {
    // Initialize user progress if needed
    if (!exports.userProgress[userId]) {
        exports.userProgress[userId] = {
            weeklyAverage: 0,
            streak: 1,
            activitiesCompleted: 0,
            moodData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [0, 0, 0, 0, 0, 0, 0]
            },
            activityData: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [0, 0, 0, 0, 0, 0, 0]
            },
            achievements: []
        };
    }
    // Get user's moods
    const userMoods = moods.filter(mood => mood.userId === userId);
    // Sort by date
    const sortedMoods = userMoods.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Get the last 7 entries
    const recentMoods = sortedMoods.slice(-7);
    if (recentMoods.length > 0) {
        // Generate labels and data arrays
        const labels = recentMoods.map(entry => {
            const date = new Date(entry.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const data = recentMoods.map(entry => {
            switch (entry.mood) {
                case 'happy': return 5;
                case 'neutral': return 3;
                case 'sad': return 1;
                default: return 0;
            }
        });
        // Update mood data in user progress
        exports.userProgress[userId].moodData = { labels, data };
        // Calculate weekly average
        const sum = data.reduce((acc, val) => acc + val, 0);
        exports.userProgress[userId].weeklyAverage = sum / data.length;
    }
    else {
        // Reset mood data if no moods exist
        exports.userProgress[userId].moodData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [0, 0, 0, 0, 0, 0, 0]
        };
        exports.userProgress[userId].weeklyAverage = 0;
    }
};
// Get all moods for the current user
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userMoods = moods.filter(mood => mood.userId === userId);
        // Map to always return 'note' field
        const mappedMoods = userMoods.map(mood => ({
            ...mood,
            note: mood.note || mood.notes || ''
        }));
        res.json(mappedMoods);
    }
    catch (error) {
        console.error('Error fetching moods:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Add a new mood entry
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { mood, notes } = req.body;
        const newMood = {
            id: nextId++,
            userId,
            mood,
            notes,
            date: new Date().toISOString()
        };
        moods.push(newMood);
        updateMoodDataInProgress(userId);
        res.status(201).json(newMood);
    }
    catch (error) {
        console.error('Error adding mood:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Delete a mood entry
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const moodId = parseInt(req.params.id);
        // Find and remove the mood
        const moodIndex = moods.findIndex(mood => mood.id === moodId && mood.userId === userId);
        if (moodIndex === -1) {
            return res.status(404).json({ success: false, error: 'Mood not found' });
        }
        moods.splice(moodIndex, 1);
        // Update progress data after deletion
        updateMoodDataInProgress(userId);
        // Force reset if no moods remain
        const userMoods = moods.filter(mood => mood.userId === userId);
        if (userMoods.length === 0) {
            exports.userProgress[userId].moodData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [0, 0, 0, 0, 0, 0, 0]
            };
            exports.userProgress[userId].weeklyAverage = 0;
            console.log('All moods deleted: moodData reset for user', userId);
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting mood:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
