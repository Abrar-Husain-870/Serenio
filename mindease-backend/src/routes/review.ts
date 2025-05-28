import express from 'express';
import { protect } from '../middleware/auth';
import { userProgress } from './moods';

const router = express.Router();

// Get analysis for the current user (dynamic, based on user data)
router.get('/analysis', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const progress = userProgress[userId];
    if (!progress) {
      return res.json({
        overallScore: 0,
        insights: [],
        recommendations: []
      });
    }

    // Calculate overall wellbeing score (0-100)
    // Only consider mood and activities, with equal weight
    let moodScore = 0;
    let hasValidMood = false;
    if (progress.moodData.data.length > 0) {
      // Filter out zero values (uninitialized mood entries)
      const validMoodData = progress.moodData.data.filter((value: number) => value > 0);
      if (validMoodData.length > 0) {
        hasValidMood = true;
        const avgMood = validMoodData.reduce((a: number, b: number) => a + b, 0) / validMoodData.length;
        moodScore = (avgMood / 5) * 50; // Convert 0-5 scale to 0-50 points
      }
    }
    
    // Calculate activity score based on completed activities
    const hasValidActivity = progress.activitiesCompleted > 0;
    const activityScore = hasValidActivity ? Math.min((progress.activitiesCompleted / 5) * 50, 50) : 0;
    // If no valid mood and no valid activity, score is 0
    const overallScore = hasValidMood || hasValidActivity ? Math.round(moodScore + activityScore) : 0;

    // Generate insights based on user data
    const insights = [];
    
    // Mood insights
    if (progress.moodData.data.length > 0) {
      const validMoodData = progress.moodData.data.filter((value: number) => value > 0);
      if (validMoodData.length > 0) {
        const avgMood = validMoodData.reduce((a: number, b: number) => a + b, 0) / validMoodData.length;
        if (avgMood < 3) {
          insights.push("Your mood has been lower than usual. Consider trying some mood-lifting activities.");
        } else if (avgMood > 4) {
          insights.push("You've been maintaining a positive mood! Keep up the great work!");
        }
      }
    }

    // Activity insights
    if (progress.activitiesCompleted > 0) {
      insights.push(`You've completed ${progress.activitiesCompleted} activities today. ${progress.activitiesCompleted >= 3 ? 'Great job staying active!' : 'Try to complete a few more activities to boost your wellbeing.'}`);
    }

    // Generate personalized recommendations
    const recommendations = [];
    
    // Mood-based recommendations
    if (progress.moodData.data.length > 0) {
      const validMoodData = progress.moodData.data.filter((value: number) => value > 0);
      if (validMoodData.length > 0) {
        const recentMood = validMoodData[validMoodData.length - 1];
        if (recentMood < 3) {
          recommendations.push("Try a guided meditation to lift your spirits");
          recommendations.push("Take a short walk outside to refresh your mind");
          recommendations.push("Practice deep breathing exercises for 5 minutes");
        }
      }
    }

    // Activity-based recommendations
    if (progress.activitiesCompleted < 3) {
      recommendations.push("Add a quick meditation session to your routine");
      recommendations.push("Try a 10-minute stretching exercise");
      recommendations.push("Write down three things you're grateful for today");
    }

    res.json({
      overallScore,
      insights,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 