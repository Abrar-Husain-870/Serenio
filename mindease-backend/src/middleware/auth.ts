import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type
declare global {
  namespace Express {
    interface User {
      _id: string;
      id: string;
      name: string;
      email: string;
      googleId?: string;
    }
  }
}

// Token payload interface
interface TokenPayload {
  userId: string;
}

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as TokenPayload;

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
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
}; 