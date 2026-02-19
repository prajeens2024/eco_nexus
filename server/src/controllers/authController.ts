import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const generateToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
};

const sanitizeUser = (user: any) => {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, company, phone, location } = req.body;

        if (!name || !email || !password) {
            throw new AppError('Name, email, and password are required', 400);
        }

        if (password.length < 8) {
            throw new AppError('Password must be at least 8 characters', 400);
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        // Build location object - handle both frontend formats
        const userLocation = {
            type: 'Point' as const,
            coordinates: location?.coordinates || [0, 0],
            address: location?.address || '',
            city: location?.city || '',
            state: location?.state || '',
        };

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || 'consumer',
            company: company || '',
            phone: phone || '',
            location: userLocation,
        });

        const token = generateToken(String(user._id), user.role);

        res.status(201).json({
            success: true,
            data: { user: sanitizeUser(user), token },
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((e: any) => e.message);
            res.status(400).json({ success: false, message: messages.join(', ') });
            return;
        }
        // Handle duplicate key errors
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError('Email and password are required', 400);
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateToken(String(user._id), user.role);

        res.json({
            success: true,
            data: { user: sanitizeUser(user), token },
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
        const updates = { ...req.body };
        // Prevent updating sensitive fields
        delete updates.password;
        delete updates.role;
        delete updates.email;
        delete updates._id;

        const user = await User.findByIdAndUpdate(req.user?._id, updates, { new: true, runValidators: true });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        res.json({ success: true, data: sanitizeUser(user) });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message || 'Update failed' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const role = req.query.role as string;
        const search = req.query.search as string;

        const filter: any = {};
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(filter).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
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
