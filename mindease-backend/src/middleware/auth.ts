import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

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
    try {
      token = req.headers.authorization.split(' ')[1].trim();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid token format' });
    }
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
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    ) as TokenPayload;

    // Fetch user from database
    const user = await User.findById(decoded.userId);
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
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
}; 