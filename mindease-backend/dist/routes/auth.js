"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        // Check if user exists in MongoDB
        let existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Create new user in MongoDB
        const user = new User_1.User({
            name,
            email,
            password
        });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });
        // Return user data without password and token
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
            token
        });
    }
    catch (error) {
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
            return res.status(400).json({ error: 'Please provide email and password' });
        }
        console.log(`Login attempt: ${email}`);
        // Find user in MongoDB
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Compare password using bcrypt
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(`Successful login: ${email}`);
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });
        // Return user and token
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Google OAuth
router.get('/google', (req, res, next) => {
    console.log('Initiating Google OAuth login');
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});
// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
    console.log('Received Google OAuth callback');
    passport_1.default.authenticate('google', {
        failureRedirect: 'https://mind-ease-olive.vercel.app/login?error=authentication_failed',
        session: true // Enable session
    })(req, res, next);
}, async (req, res) => {
    try {
        console.log('Processing Google OAuth callback');
        const user = req.user;
        if (!user || !user.id) {
            console.error('Failed to get user ID from user object:', user);
            return res.redirect('https://mind-ease-olive.vercel.app/login?error=authentication_failed');
        }
        console.log('Generating JWT token for user:', user.id);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });
        // Set the token in a secure HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        console.log('Redirecting to OAuth success page');
        // Redirect to OAuth success page instead of directly to dashboard
        res.redirect('https://mind-ease-olive.vercel.app/oauth-success');
    }
    catch (error) {
        console.error('Error in Google callback:', error);
        res.redirect('https://mind-ease-olive.vercel.app/login?error=server_error');
    }
});
// Get current user from token
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return user data without password
        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Verify token endpoint
router.get('/verify-token', auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email
        });
    }
    catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
