"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get analysis for the current user
router.get('/analysis', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        // In a real application, you would gather data from various collections
        // and perform analysis to generate insights
        // For demonstration, we'll create a sample analysis response
        const analysis = {
            overallScore: 78,
            overallFeedback: "Your overall mental well-being appears stable. Keep up with your daily activities and journaling.",
            moodDistribution: {
                happy: "35%",
                neutral: "45%",
                sad: "20%"
            },
            totalMoodEntries: 20,
            insights: [
                {
                    id: 1,
                    title: "Mood Pattern Detected",
                    description: "Your mood tends to improve on days when you complete activities."
                },
                {
                    id: 2,
                    title: "Journaling Consistency",
                    description: "Regular journaling has been associated with your improved mood."
                }
            ],
            recommendations: [
                {
                    id: 1,
                    title: "Try Morning Meditation",
                    description: "Adding a short meditation in your morning routine may help stabilize your daily mood."
                },
                {
                    id: 2,
                    title: "Outdoor Activity",
                    description: "Your mood records show improvement when you spend time outdoors."
                },
                {
                    id: 3,
                    title: "Gratitude Practice",
                    description: "Consider adding a gratitude section to your journal entries."
                }
            ],
        };
        res.json(analysis);
    }
    catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
exports.default = router;
