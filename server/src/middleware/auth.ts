import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
            return;
        }

        const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'Invalid token or user deactivated.' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

export const roleGuard = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
            return;
        }
        next();
    };
};
