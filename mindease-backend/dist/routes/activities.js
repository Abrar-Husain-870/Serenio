"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const moods_1 = require("./moods");
const router = express_1.default.Router();
// Mock activities data store (replace with database in production)
let activities = [];
let nextId = 1;
// Get all activities for the current user
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userActivities = activities.filter(activity => activity.userId === userId);
        res.json(userActivities);
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Add a new activity
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, type, duration, completed = false } = req.body;
        // Validate required fields
        if (!title || !type || !duration) {
            return res.status(400).json({ success: false, error: 'Please provide title, type, and duration' });
        }
        const newActivity = {
            id: nextId++,
            userId,
            title,
            description,
            type,
            duration,
            completed,
            date: req.body.date || new Date().toISOString()
        };
        activities.push(newActivity);
        res.status(201).json(newActivity);
    }
    catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Toggle activity completion status - support both PUT and PATCH methods
const toggleActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const activityId = parseInt(req.params.id);
        console.log(`Toggle request for activity ${activityId} by user ${userId}`);
        if (isNaN(activityId)) {
            console.error(`Invalid activity ID: ${req.params.id}`);
            return res.status(400).json({ success: false, error: 'Invalid activity ID' });
        }
        // Find activity by ID (comparing as string or number)
        const activityIndex = activities.findIndex(a => (a.id === activityId || a.id === req.params.id) && a.userId === userId);
        if (activityIndex === -1) {
            console.error(`Activity not found: ID ${activityId} for user ${userId}`);
            return res.status(404).json({ success: false, error: 'Activity not found' });
        }
        // Toggle the completion status
        activities[activityIndex].completed = !activities[activityIndex].completed;
        const updatedActivity = activities[activityIndex];
        console.log(`Activity ${activityId} updated: completed = ${updatedActivity.completed}`);
        // Return the updated activity
        return res.json({
            success: true,
            data: updatedActivity
        });
    }
    catch (error) {
        console.error('Error toggling activity:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};
// Support both methods
router.patch('/:id/toggle', auth_1.protect, toggleActivity);
router.put('/:id/toggle', auth_1.protect, toggleActivity);
// Delete an activity
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const activityId = parseInt(req.params.id);
        console.log('All activities at delete time:', activities);
        if (isNaN(activityId)) {
            return res.status(400).json({ success: false, error: 'Invalid activity ID' });
        }
        const activityIndex = activities.findIndex(a => (a.id === activityId || a.id === req.params.id) && a.userId === userId);
        if (activityIndex === -1) {
            return res.status(404).json({ success: false, error: 'Activity not found' });
        }
        activities.splice(activityIndex, 1);
        // Update progress data after deletion
        if (moods_1.userProgress[userId]) {
            moods_1.userProgress[userId].activitiesCompleted = Math.max(0, moods_1.userProgress[userId].activitiesCompleted - 1);
            // Update today's activity count in the chart data
            const today = new Date().getDay();
            const dayIndex = today === 0 ? 6 : today - 1;
            if (moods_1.userProgress[userId].activityData.data[dayIndex] > 0) {
                moods_1.userProgress[userId].activityData.data[dayIndex] -= 1;
            }
        }
        res.json({ success: true, message: 'Activity deleted' });
    }
    catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
