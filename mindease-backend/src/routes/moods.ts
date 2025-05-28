import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Mock moods data store (replace with database in production)
let moods: any[] = [];
let nextId = 1;

// Import or define reference to user progress (in-memory for this demo)
// This should match the structure used in progress.ts
export let userProgress: Record<string, any> = {};

// Function to update mood data in progress
const updateMoodDataInProgress = (userId: string) => {
  // Initialize user progress if needed
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
  
  // Get user's moods
  const userMoods = moods.filter(mood => mood.userId === userId);
  
  // Sort by date
  const sortedMoods = userMoods.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
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
    userProgress[userId].moodData = { labels, data };
    
    // Calculate weekly average
    const sum = data.reduce((acc: number, val: number) => acc + val, 0);
    userProgress[userId].weeklyAverage = sum / data.length;
  }
};

// Get all mood entries for the current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userMoods = moods.filter(mood => mood.userId === userId);
    res.json(userMoods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new mood entry
router.post('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { mood, note } = req.body;
    
    // Validate required fields
    if (!mood) {
      return res.status(400).json({ success: false, error: 'Please provide mood value' });
    }
    
    const newMood = {
      id: nextId++,
      userId,
      mood,
      note: note || '',
      date: req.body.date || new Date().toISOString()
    };
    
    moods.push(newMood);
    
    // Update progress data with new mood info
    updateMoodDataInProgress(userId);
    
    res.status(201).json(newMood);
  } catch (error) {
    console.error('Error adding mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a mood entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const moodId = parseInt(req.params.id);
    
    const initialLength = moods.length;
    moods = moods.filter(mood => !(mood.id === moodId && mood.userId === userId));
    
    if (moods.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Mood entry not found' });
    }
    
    // Update progress data after deletion
    updateMoodDataInProgress(userId);
    
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 