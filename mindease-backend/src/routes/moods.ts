import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Mock moods data store (replace with database in production)
let moods: any[] = [];
let nextId = 1;

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
    
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 