import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

// Mock users data store (replace with database in production)
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password' // Store plaintext passwords for simplicity in this demo
  }
];

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Check if user exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user (using plaintext password for demo)
    const newUserId = (users.length + 1).toString();
    const newUser = {
      id: newUserId,
      name,
      email,
      password // Store plaintext for demo purposes
    };
    
    users.push(newUser);
    console.log('New user registered:', { ...newUser, password: '[HIDDEN]' });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: newUserId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Return user data without password and token
    res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }
    
    console.log(`Login attempt: ${email}`);
    
    // Check if user exists
    const user = users.find(user => user.email === email);
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // For demo purposes, directly compare passwords 
    const isMatch = user.password === password;
    
    if (!isMatch) {
      console.log(`Password mismatch for user: ${email}`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    console.log(`Successful login: ${email}`);
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    // Return user and token
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  // Issue JWT and redirect to frontend with token
  const user = req.user as any;
  const userId = user._id ? user._id : user.id;
  
  if (!userId) {
    console.error('Failed to get user ID from user object:', user);
    return res.redirect('http://localhost:3000/login?error=authentication_failed');
  }
  
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
  
  // Redirect to frontend with token
  res.redirect(`http://localhost:3000/oauth-success?token=${token}`);
});

// Get current user from token
router.get('/me', protect, async (req, res) => {
  try {
    // First, check if user exists in mock users
    let user = users.find(user => user.id === req.user?.id);
    
    if (!user) {
      // If not found in mock users, this might be a Google user
      // Look up the mongoose User model
      try {
        const mongoUser = await User.findById(req.user?._id || req.user?.id);
        if (mongoUser) {
          // Return mongoose user data
          return res.json({
            id: mongoUser._id.toString(),
            name: mongoUser.name,
            email: mongoUser.email,
            googleId: mongoUser.googleId
          });
        }
      } catch (err) {
        console.error('Error looking up MongoDB user:', err);
      }
      
      // If we get here, the user doesn't exist in either system
      // For testing purposes, let's create a mock user based on req.user id
      if (req.user) {
        console.log('Creating mock user for OAuth user:', req.user);
        return res.json({
          id: req.user.id || req.user._id,
          name: req.user.name || "Google User",
          email: req.user.email || "google.user@example.com"
        });
      }
      
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password (match frontend expected format)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test authentication route
router.get('/test-auth', protect, (req, res) => {
  res.json({ message: 'Authentication successful', userId: req.user?.id });
});

export default router; 