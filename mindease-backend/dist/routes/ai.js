"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const moods_1 = require("./moods");
const router = express_1.default.Router();
// Store assessment history in memory (replace with database in production)
let assessmentHistory = {};
// Get assessment history
router.get('/assessment/history', auth_1.protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const userHistory = assessmentHistory[userId] || [];
        res.json({ assessments: userHistory });
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
            date: new Date().toISOString(),
            score: averageScore.toFixed(1),
            scoreLevel,
            analysis,
            recommendations
        };
        // Store in history
        if (!assessmentHistory[userId]) {
            assessmentHistory[userId] = [];
        }
        assessmentHistory[userId].push(assessment);
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
exports.default = router;
