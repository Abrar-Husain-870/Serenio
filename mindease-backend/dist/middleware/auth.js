"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
    let token;
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check if token exists in cookies
    else if (req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token;
    }
    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Fetch user from database
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }
        // Set the user on the request object
        req.user = {
            _id: user._id.toString(),
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            googleId: user.googleId
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
