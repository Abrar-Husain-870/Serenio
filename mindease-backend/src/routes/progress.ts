import express from 'express';
import { protect } from '../middleware/auth';
import { userProgress } from './moods';

const router = express.Router();

// Get user progress data
router.get('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    
    // Initialize progress data if it doesn't exist for this user
    if (!userProgress[userId]) {
      userProgress[userId] = {
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
    
    res.json(userProgress[userId]);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update progress endpoint - handles activity completions and other progress updates
router.post('/update', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { activityCompleted } = req.body;
    
    // Initialize progress data if it doesn't exist for this user
    if (!userProgress[userId]) {
      userProgress[userId] = {
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
    
    // Update activities completed count
    if (activityCompleted) {
      userProgress[userId].activitiesCompleted += 1;
      
      // Update today's activity count in the chart data
      const today = new Date().getDay();
      // Convert Sunday (0) to be the last day of the week (6)
      const dayIndex = today === 0 ? 6 : today - 1;
      userProgress[userId].activityData.data[dayIndex] += 1;
      
      // Check for achievements
      if (userProgress[userId].activitiesCompleted === 5) {
        userProgress[userId].achievements.push({
          id: 'achievement_5',
          title: 'Activity Starter',
          description: 'Completed 5 wellness activities'
        });
      } else if (userProgress[userId].activitiesCompleted === 10) {
        userProgress[userId].achievements.push({
          id: 'achievement_10',
          title: 'Wellness Enthusiast',
          description: 'Completed 10 wellness activities'
        });
      } else if (userProgress[userId].activitiesCompleted === 25) {
        userProgress[userId].achievements.push({
          id: 'achievement_25',
          title: 'Mental Health Champion',
          description: 'Completed 25 wellness activities'
        });
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Progress updated successfully',
      data: userProgress[userId]
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 