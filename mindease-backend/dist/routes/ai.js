"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const moods_1 = require("./moods");
const AssessmentHistory_1 = __importDefault(require("../models/AssessmentHistory"));
const geminiService_1 = require("../utils/geminiService");
const Mood_1 = __importDefault(require("../models/Mood"));
const journal_1 = __importDefault(require("../models/journal"));
const router = express_1.default.Router();
// Get assessment history
router.get('/assessment/history', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        let history = await AssessmentHistory_1.default.findOne({ user: userId });
        if (!history) {
            history = new AssessmentHistory_1.default({ user: userId, assessments: [] });
            await history.save();
        }
        res.json({ assessments: history.assessments });
    }
    catch (error) {
        console.error('Error fetching assessment history:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Generate assessment results
router.post('/assessment/generate', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { answers } = req.body;
        // Calculate total score (sum of all answers)
        const totalScore = Object.values(answers).reduce((sum, value) => sum + Number(value), 0);
        const averageScore = totalScore / Object.keys(answers).length;
        // Determine score level
        let scoreLevel;
        if (averageScore >= 4) {
            scoreLevel = 'high';
        }
        else if (averageScore >= 2.5) {
            scoreLevel = 'moderate';
        }
        else {
            scoreLevel = 'low';
        }
        // Generate analysis based on score level
        let analysis = '';
        let recommendations = [];
        switch (scoreLevel) {
            case 'high':
                analysis = 'Your mental health assessment indicates a positive state of well-being. You show good emotional resilience and coping mechanisms.';
                recommendations = [
                    'Continue maintaining your current healthy habits',
                    'Share your positive coping strategies with others',
                    'Consider journaling to track what contributes to your well-being'
                ];
                break;
            case 'moderate':
                analysis = 'Your assessment shows some areas that could benefit from attention. While you are managing, there is room for improvement in certain aspects of your mental well-being.';
                recommendations = [
                    'Practice regular mindfulness or meditation',
                    'Ensure you are getting adequate sleep and exercise',
                    'Consider talking to a mental health professional for additional support'
                ];
                break;
            case 'low':
                analysis = 'Your assessment suggests you may be experiencing significant challenges with your mental well-being. It is important to take these results seriously and seek support.';
                recommendations = [
                    'Reach out to a mental health professional for support',
                    'Consider talking to trusted friends or family members',
                    'Practice self-care and stress management techniques',
                    'Consider joining a support group'
                ];
                break;
        }
        const assessment = {
            id: Date.now().toString(),
            date: new Date(),
            score: averageScore.toFixed(1),
            scoreLevel,
            analysis,
            recommendations
        };
        // Save to MongoDB
        let history = await AssessmentHistory_1.default.findOne({ user: userId });
        if (!history) {
            history = new AssessmentHistory_1.default({ user: userId, assessments: [assessment] });
        }
        else {
            history.assessments.unshift(assessment); // Add to the beginning
        }
        await history.save();
        res.json(assessment);
    }
    catch (error) {
        console.error('Error generating assessment:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
// Get positive quote
router.get('/quotes/positive', auth_1.protect, (req, res) => {
    const quotes = [
        "Every day is a new beginning.",
        "You are stronger than you think.",
        "Small steps lead to big changes.",
        "Your potential is limitless.",
        "Today is your day to shine.",
        "You've got this!",
        "Believe in yourself.",
        "Make today amazing.",
        "You are capable of great things.",
        "Keep going, you're doing great!"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
});
// Get AI analysis
router.get('/analysis', auth_1.protect, (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const progress = moods_1.userProgress[req.user.id];
        if (!progress) {
            return res.json({
                overallScore: 0,
                insights: [],
                recommendations: []
            });
        }
        // Calculate overall wellbeing score (0-100)
        const moodScore = progress.moodData.data.reduce((a, b) => a + b, 0) / progress.moodData.data.length * 20;
        const activityScore = (progress.activitiesCompleted / 5) * 40; // Max 5 activities per day
        const streakScore = Math.min(progress.streak * 4, 40); // Max 10 days streak
        const overallScore = Math.min(100, Math.round(moodScore + activityScore + streakScore));
        // Generate insights based on user data
        const insights = [];
        // Mood insights
        if (progress.moodData.data.length > 0) {
            const avgMood = progress.moodData.data.reduce((a, b) => a + b, 0) / progress.moodData.data.length;
            if (avgMood < 3) {
                insights.push("Your mood has been lower than usual. Consider trying some mood-lifting activities.");
            }
            else if (avgMood > 4) {
                insights.push("You've been maintaining a positive mood! Keep up the great work!");
            }
        }
        // Activity insights
        if (progress.activitiesCompleted > 0) {
            insights.push(`You've completed ${progress.activitiesCompleted} activities today. ${progress.activitiesCompleted >= 3 ? 'Great job staying active!' : 'Try to complete a few more activities to boost your wellbeing.'}`);
        }
        // Streak insights
        if (progress.streak > 0) {
            insights.push(`You're on a ${progress.streak}-day streak! Consistency is key to mental wellbeing.`);
        }
        // Generate personalized recommendations
        const recommendations = [];
        // Mood-based recommendations
        if (progress.moodData.data.length > 0) {
            const recentMood = progress.moodData.data[progress.moodData.data.length - 1];
            if (recentMood < 3) {
                recommendations.push("Try a guided meditation to lift your spirits");
                recommendations.push("Take a short walk outside to refresh your mind");
                recommendations.push("Practice deep breathing exercises for 5 minutes");
            }
        }
        // Activity-based recommendations
        if (progress.activitiesCompleted < 3) {
            recommendations.push("Add a quick meditation session to your routine");
            recommendations.push("Try a 10-minute stretching exercise");
            recommendations.push("Write down three things you're grateful for today");
        }
        // Streak-based recommendations
        if (progress.streak > 0) {
            recommendations.push("Maintain your streak by planning tomorrow's activities");
            recommendations.push("Reflect on what's been working well for you");
        }
        res.json({
            overallScore,
            insights,
            recommendations
        });
    }
    catch (error) {
        console.error('Error generating analysis:', error);
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
});
// New AI-powered endpoints
// Generate AI mood summary
router.post('/mood-summary', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get recent mood and journal data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const [moodData, journalData] = await Promise.all([
            Mood_1.default.find({ user: userId, date: { $gte: sevenDaysAgo } }).sort({ date: -1 }),
            journal_1.default.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 })
        ]);
        const summary = await (0, geminiService_1.generateMoodSummary)(moodData, journalData);
        res.json(summary);
    }
    catch (error) {
        console.error('Error generating mood summary:', error);
        res.status(500).json({ error: 'Failed to generate mood summary' });
    }
});
// Generate CBT thought record
router.post('/cbt-thought-record', auth_1.protect, async (req, res) => {
    try {
        const { negativeThought } = req.body;
        if (!negativeThought) {
            return res.status(400).json({ error: 'Negative thought is required' });
        }
        const thoughtRecord = await (0, geminiService_1.generateCBTThoughtRecord)(negativeThought);
        res.json(thoughtRecord);
    }
    catch (error) {
        console.error('Error generating CBT thought record:', error);
        res.status(500).json({ error: 'Failed to generate CBT thought record' });
    }
});
// Generate wellness plan
router.post('/create-plan', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get recent mood and journal data (last 14 days for better planning)
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const [moodData, journalData] = await Promise.all([
            Mood_1.default.find({ user: userId, date: { $gte: fourteenDaysAgo } }).sort({ date: -1 }),
            journal_1.default.find({ user: userId, createdAt: { $gte: fourteenDaysAgo } }).sort({ createdAt: -1 })
        ]);
        const plan = await (0, geminiService_1.generateWellnessPlan)(moodData, journalData);
        res.json(plan);
    }
    catch (error) {
        console.error('Error generating wellness plan:', error);
        res.status(500).json({ error: 'Failed to generate wellness plan' });
    }
});
// Detect relapse signals
router.post('/relapse-signals', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        // Get recent mood and journal data (last 10 days for pattern analysis)
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const [moodData, journalData] = await Promise.all([
            Mood_1.default.find({ user: userId, date: { $gte: tenDaysAgo } }).sort({ date: -1 }),
            journal_1.default.find({ user: userId, createdAt: { $gte: tenDaysAgo } }).sort({ createdAt: -1 })
        ]);
        const signals = await (0, geminiService_1.detectRelapseSignals)(moodData, journalData);
        res.json(signals);
    }
    catch (error) {
        console.error('Error detecting relapse signals:', error);
        res.status(500).json({ error: 'Failed to detect relapse signals' });
    }
});
exports.default = router;
