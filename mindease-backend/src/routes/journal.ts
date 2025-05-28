import express from 'express';
import { protect } from '../middleware/auth';
import Journal from '../models/journal';

const router = express.Router();

// Get all journal entries for the current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userEntries = await Journal.find({ user: userId }).sort({ createdAt: -1 });
    // Map to frontend shape
    const mappedEntries = userEntries.map(entry => ({
      id: entry._id,
      date: entry.createdAt,
      content: entry.content,
      mood: entry.mood,
      sentiment: 'neutral', // default or add logic if needed
    }));
    res.json(mappedEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new journal entry
router.post('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { title, content, mood, isShared } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Please provide title and content' });
    }
    
    const newEntry = new Journal({
      user: userId,
      content,
      mood: mood || 'neutral',
      isShared: isShared || false,
      createdAt: new Date(),
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a journal entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const entryId = req.params.id;
    const deleted = await Journal.findOneAndDelete({ _id: entryId, user: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Journal entry not found' });
    }
    res.json({ success: true, message: 'Journal entry deleted' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get shared journal entries
router.get('/shared', protect, async (req, res) => {
  try {
    const sharedEntries = await Journal.find({ isShared: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(sharedEntries);
  } catch (error) {
    console.error('Error fetching shared journals:', error);
    res.status(500).json({ message: 'Error fetching shared journals' });
  }
});

// Community journals endpoint
router.get('/community', async (req, res) => {
  try {
    const communityJournals = await Journal.find({ isShared: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(communityJournals);
  } catch (error) {
    console.error('Error fetching community journals:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 