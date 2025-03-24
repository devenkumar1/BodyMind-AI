import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface JwtPayload {
  id: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}

// Authentication middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Set user in request
    req.user = { id: user._id.toString() };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Admin middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user.id)
    .then((user) => {
      if (user && user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Not authorized as admin' });
      }
    })
    .catch(() => {
      res.status(401).json({ message: 'Not authorized, user not found' });
    });
}; 