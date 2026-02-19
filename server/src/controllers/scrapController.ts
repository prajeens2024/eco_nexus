import { Response } from 'express';
import ScrapListing from '../models/ScrapListing';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Simulated market rates per category (INR/kg)
const MARKET_RATES: Record<string, { rate: number; trend: number }> = {
    ferrous_metal: { rate: 28.5, trend: 2.3 },
    non_ferrous_metal: { rate: 185.0, trend: -1.2 },
    plastic: { rate: 15.0, trend: 3.8 },
    rubber: { rate: 12.0, trend: 0.5 },
    glass: { rate: 5.5, trend: -0.3 },
    paper: { rate: 14.0, trend: 1.1 },
    electronic: { rate: 350.0, trend: 5.2 },
    textile: { rate: 8.5, trend: -0.8 },
    chemical: { rate: 22.0, trend: 1.5 },
    other: { rate: 10.0, trend: 0.0 },
};

export const createScrapListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const category = req.body.category as string;
        const marketRate = MARKET_RATES[category]?.rate || 10;

        const listing = await ScrapListing.create({
            ...req.body,
            seller: req.user?._id,
            marketRate,
        });
        res.status(201).json({ success: true, data: listing });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getScrapListings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        const filter: any = {};

        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.quality) filter.quality = req.query.quality;
        if (req.query.city) filter['location.city'] = new RegExp(req.query.city as string, 'i');

        const [listings, total] = await Promise.all([
            ScrapListing.find(filter)
                .populate('seller', 'name company avatar reputation')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            ScrapListing.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: listings,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getScrapById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const listing = await ScrapListing.findById(req.params.id).populate('seller', 'name company avatar reputation phone email');
        if (!listing) throw new AppError('Listing not found', 404);
        res.json({ success: true, data: listing });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateScrapListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const listing = await ScrapListing.findById(req.params.id);
        if (!listing) throw new AppError('Listing not found', 404);
        if (listing.seller.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
            throw new AppError('Not authorized', 403);
        }

        const updated = await ScrapListing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, data: updated });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteScrapListing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const listing = await ScrapListing.findById(req.params.id);
        if (!listing) throw new AppError('Listing not found', 404);
        if (listing.seller.toString() !== req.user?._id?.toString() && req.user?.role !== 'admin') {
            throw new AppError('Not authorized', 403);
        }

        await ScrapListing.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Listing deleted' });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMarketRates = async (_req: AuthRequest, res: Response): Promise<void> => {
    // Simulate live market rates with slight randomization
    const rates = Object.entries(MARKET_RATES).map(([category, data]) => ({
        category,
        rate: +(data.rate + (Math.random() * 2 - 1)).toFixed(2),
        trend: data.trend,
        lastUpdated: new Date(),
    }));

    res.json({ success: true, data: rates });
};

export const getScrapTrends = async (_req: AuthRequest, res: Response): Promise<void> => {
    // Generate 30-day historical trend data
    const categories = Object.keys(MARKET_RATES);
    const trends = categories.map((category) => {
        const baseRate = MARKET_RATES[category].rate;
        const history = Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
            price: +(baseRate + Math.sin(i / 5) * baseRate * 0.1 + (Math.random() * 2 - 1)).toFixed(2),
            volume: Math.floor(Math.random() * 1000 + 200),
        }));
        return { category, history };
    });

    res.json({ success: true, data: trends });
};
