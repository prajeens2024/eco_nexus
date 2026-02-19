import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const generateToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, company, phone, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'consumer',
            company,
            phone,
            location: location || { type: 'Point', coordinates: [0, 0], address: '', city: '', state: '' },
        });

        const token = generateToken(user._id as string, user.role);

        res.status(201).json({
            success: true,
            data: { user, token },
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateToken(user._id as string, user.role);

        res.json({
            success: true,
            data: { user, token },
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message || 'Login failed' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({ success: true, data: req.user });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const updates = req.body;
        delete updates.password;
        delete updates.role;
        delete updates.email;

        const user = await User.findByIdAndUpdate(req.user?._id, updates, { new: true, runValidators: true });
        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Update failed' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const role = req.query.role as string;

        const filter: any = {};
        if (role) filter.role = role;

        const [users, total] = await Promise.all([
            User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
