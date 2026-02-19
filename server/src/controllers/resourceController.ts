import { Response } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const createResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resource = await Resource.create({
            ...req.body,
            owner: req.user?._id,
        });
        res.status(201).json({ success: true, data: resource });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getResources = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (req.query.type) filter.type = req.query.type;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.city) filter['location.city'] = new RegExp(req.query.city as string, 'i');

        if (req.query.minPrice || req.query.maxPrice) {
            filter['priceModel.amount'] = {};
            if (req.query.minPrice) filter['priceModel.amount'].$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter['priceModel.amount'].$lte = Number(req.query.maxPrice);
        }

        if (req.query.search) {
            filter.$text = { $search: req.query.search as string };
        }

        const sortField = req.query.sortBy as string || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const [resources, total] = await Promise.all([
            Resource.find(filter)
                .populate('owner', 'name company avatar reputation')
                .skip(skip)
                .limit(limit)
                .sort({ [sortField]: sortOrder }),
            Resource.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: resources,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getResourceById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resource = await Resource.findById(req.params.id).populate('owner', 'name company avatar reputation phone email location');
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        res.json({ success: true, data: resource });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        if (resource.owner.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
            throw new AppError('Not authorized to update this resource', 403);
        }

        const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteResource = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        if (resource.owner.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
            throw new AppError('Not authorized to delete this resource', 403);
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyResources = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resources = await Resource.find({ owner: req.user?._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: resources });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNearbyResources = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { lng, lat, maxDistance = 50000, type } = req.query;

        if (!lng || !lat) {
            throw new AppError('Longitude and latitude required', 400);
        }

        const filter: any = {
            'location.coordinates': {
                $near: {
                    $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
                    $maxDistance: Number(maxDistance),
                },
            },
            status: 'active',
        };

        if (type) filter.type = type;

        const resources = await Resource.find(filter)
            .populate('owner', 'name company avatar reputation')
            .limit(20);

        res.json({ success: true, data: resources });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
