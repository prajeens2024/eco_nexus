import { Response } from 'express';
import Resource from '../models/Resource';
import Transaction from '../models/Transaction';
import User from '../models/User';
import ScrapListing from '../models/ScrapListing';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role;

        let resourceFilter: any = {};
        let txnFilter: any = {};

        if (role === 'provider') {
            resourceFilter = { owner: userId };
            txnFilter = { provider: userId };
        } else if (role === 'consumer') {
            txnFilter = { consumer: userId };
        }

        const [
            totalResources,
            activeResources,
            totalTransactions,
            completedTransactions,
            totalUsers,
            totalScrapListings,
            revenueAgg,
        ] = await Promise.all([
            Resource.countDocuments(role === 'admin' ? {} : resourceFilter),
            Resource.countDocuments({ ...resourceFilter, status: 'active' }),
            Transaction.countDocuments(role === 'admin' ? {} : txnFilter),
            Transaction.countDocuments({ ...(role === 'admin' ? {} : txnFilter), status: 'payment_released' }),
            role === 'admin' ? User.countDocuments() : Promise.resolve(0),
            ScrapListing.countDocuments(role === 'admin' ? {} : { seller: userId }),
            Transaction.aggregate([
                { $match: { ...(role === 'admin' ? {} : txnFilter), status: 'payment_released' } },
                { $group: { _id: null, total: { $sum: '$amount' }, avg: { $avg: '$amount' } } },
            ]),
        ]);

        const revenue = revenueAgg[0] || { total: 0, avg: 0 };

        res.json({
            success: true,
            data: {
                totalResources,
                activeResources,
                idleResources: totalResources - activeResources,
                totalTransactions,
                completedTransactions,
                pendingTransactions: totalTransactions - completedTransactions,
                totalRevenue: revenue.total,
                avgTransactionValue: Math.round(revenue.avg || 0),
                totalUsers,
                totalScrapListings,
                utilizationRate: totalResources > 0 ? Math.round((activeResources / totalResources) * 100) : 0,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUtilizationData = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const utilization = await Resource.aggregate([
            { $group: { _id: '$type', total: { $sum: 1 }, active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }, booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } } } },
            { $project: { type: '$_id', total: 1, active: 1, booked: 1, idle: { $subtract: ['$total', { $add: ['$active', '$booked'] }] }, utilizationRate: { $multiply: [{ $divide: [{ $add: ['$active', '$booked'] }, { $max: ['$total', 1] }] }, 100] } } },
        ]);

        res.json({ success: true, data: utilization });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRevenueTimeline = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const startDate = new Date(Date.now() - days * 86400000);

        const timeline = await Transaction.aggregate([
            { $match: { status: 'payment_released', createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { date: '$_id', revenue: 1, count: 1 } },
        ]);

        res.json({ success: true, data: timeline });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEnvironmentalImpact = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const completedTxns = await Transaction.countDocuments({ status: 'payment_released' });
        const totalResources = await Resource.countDocuments();
        const scrapTraded = await ScrapListing.countDocuments({ status: 'sold' });

        // Estimated environmental proxy metrics
        const data = {
            resourcesShared: totalResources,
            transactionsCompleted: completedTxns,
            scrapRecycled: scrapTraded,
            estimatedCO2Saved: completedTxns * 12.5, // kg CO2 per shared resource usage
            estimatedWasteDiverted: scrapTraded * 250, // kg waste
            circularEconomyScore: Math.min(100, Math.round((completedTxns + scrapTraded) * 2.5)),
            treesEquivalent: Math.round(completedTxns * 0.15),
        };

        res.json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTopPerformers = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const topProviders = await Transaction.aggregate([
            { $match: { status: 'payment_released' } },
            { $group: { _id: '$provider', totalRevenue: { $sum: '$amount' }, transactions: { $sum: 1 } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $project: { name: '$user.name', company: '$user.company', totalRevenue: 1, transactions: 1 } },
        ]);

        res.json({ success: true, data: topProviders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const role = req.user?.role;

        let filter: any = {};
        if (role === 'provider') filter = { provider: userId };
        else if (role === 'consumer') filter = { consumer: userId };

        const recentTransactions = await Transaction.find(filter)
            .populate('resource', 'title type')
            .populate('provider', 'name company')
            .populate('consumer', 'name company')
            .sort({ updatedAt: -1 })
            .limit(10);

        res.json({ success: true, data: recentTransactions });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
