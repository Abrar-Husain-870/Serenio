"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const moods_1 = require("./moods");
const router = express_1.default.Router();
// Store completed challenges
const completedChallenges = {};
// Get user progress data
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        // Initialize progress data if it doesn't exist for this user
        if (!moods_1.userProgress[userId]) {
            moods_1.userProgress[userId] = {
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
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Initialize completed challenges for user if not exists
        if (!completedChallenges[userId]) {
            completedChallenges[userId] = new Set();
        }
        // Add completed challenges to the response
        const response = {
            ...moods_1.userProgress[userId],
            completedChallenges: Array.from(completedChallenges[userId])
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Update progress endpoint - handles activity completions and other progress updates
router.post('/update', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { activityCompleted, challengeCompleted } = req.body;
        // Initialize progress data if it doesn't exist for this user
        if (!moods_1.userProgress[userId]) {
            moods_1.userProgress[userId] = {
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
        // Initialize completed challenges for user if not exists
        if (!completedChallenges[userId]) {
            completedChallenges[userId] = new Set();
        }
        // Update activities completed count
        if (activityCompleted === true) {
            moods_1.userProgress[userId].activitiesCompleted += 1;
            // Update today's activity count in the chart data
            const today = new Date().getDay();
            // Convert Sunday (0) to be the last day of the week (6)
            const dayIndex = today === 0 ? 6 : today - 1;
            moods_1.userProgress[userId].activityData.data[dayIndex] += 1;
            // Check for achievements
            if (moods_1.userProgress[userId].activitiesCompleted === 5) {
                moods_1.userProgress[userId].achievements.push({
                    id: 'achievement_5',
                    title: 'Activity Starter',
                    description: 'Completed 5 wellness activities'
                });
            }
            else if (moods_1.userProgress[userId].activitiesCompleted === 10) {
                moods_1.userProgress[userId].achievements.push({
                    id: 'achievement_10',
                    title: 'Wellness Enthusiast',
                    description: 'Completed 10 wellness activities'
                });
            }
            else if (moods_1.userProgress[userId].activitiesCompleted === 25) {
                moods_1.userProgress[userId].achievements.push({
                    id: 'achievement_25',
                    title: 'Mental Health Champion',
                    description: 'Completed 25 wellness activities'
                });
            }
        }
        else if (activityCompleted === false) {
            // Reset activities completed count and activity data when an activity is deleted
            moods_1.userProgress[userId].activitiesCompleted = 0;
            moods_1.userProgress[userId].activityData.data = [0, 0, 0, 0, 0, 0, 0];
        }
        // Handle challenge completion
        if (challengeCompleted) {
            const today = new Date().toISOString().split('T')[0];
            completedChallenges[userId].add(today);
        }
        res.json({
            success: true,
            message: 'Progress updated successfully',
            data: {
                ...moods_1.userProgress[userId],
                completedChallenges: Array.from(completedChallenges[userId])
            }
        });
    }
    catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
