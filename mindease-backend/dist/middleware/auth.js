"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
    let token;
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // In a real app, you would fetch the user from database using decoded.userId
        // Set the user ID on the request object
        // Simplified mock user object that matches our User interface
        req.user = {
            _id: decoded.userId,
            id: decoded.userId,
            name: "User",
            email: "user@example.com"
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
