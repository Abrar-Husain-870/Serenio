import express, { Request, Response } from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Mock activities data store (replace with database in production)
let activities: any[] = [];
let nextId = 1;

// Get all activities for the current user
router.get('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userActivities = activities.filter(activity => activity.userId === userId);
    res.json(userActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new activity
router.post('/', protect, async (req, res) => {
  try {
    const userId = (req as any).user.id;
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
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Toggle activity completion status - support both PUT and PATCH methods
const toggleActivity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const activityId = parseInt(req.params.id);
    
    console.log(`Toggle request for activity ${activityId} by user ${userId}`);
    
    if (isNaN(activityId)) {
      console.error(`Invalid activity ID: ${req.params.id}`);
      return res.status(400).json({ success: false, error: 'Invalid activity ID' });
    }
    
    // Find activity by ID (comparing as string or number)
    const activityIndex = activities.findIndex(a => 
      (a.id === activityId || a.id === req.params.id) && a.userId === userId
    );
    
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
  } catch (error) {
    console.error('Error toggling activity:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Support both methods
router.patch('/:id/toggle', protect, toggleActivity);
router.put('/:id/toggle', protect, toggleActivity);

export default router; 