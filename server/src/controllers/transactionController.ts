import { Response } from 'express';
import Transaction from '../models/Transaction';
import Resource from '../models/Resource';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resourceId, startDate, endDate } = req.body;
        const resource = await Resource.findById(resourceId);
        if (!resource) throw new AppError('Resource not found', 404);
        if (resource.status !== 'active') throw new AppError('Resource is not available', 400);
        if (resource.owner.toString() === req.user?._id?.toString()) throw new AppError('Cannot book your own resource', 400);

        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;
        let amount = resource.priceModel.amount;
        if (resource.priceModel.type === 'daily') amount *= days;
        if (resource.priceModel.type === 'weekly') amount *= Math.ceil(days / 7);
        if (resource.priceModel.type === 'monthly') amount *= Math.ceil(days / 30);

        const transaction = await Transaction.create({
            resource: resourceId,
            provider: resource.owner,
            consumer: req.user?._id,
            status: 'requested',
            amount,
            escrowAmount: 0,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            timeline: [{ event: 'Booking requested', status: 'requested', timestamp: new Date() }],
        });

        const populated = await Transaction.findById(transaction._id)
            .populate('resource', 'title type')
            .populate('provider', 'name company')
            .populate('consumer', 'name company');

        res.status(201).json({ success: true, data: populated });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const approveTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) throw new AppError('Transaction not found', 404);
        if (txn.provider.toString() !== req.user?._id?.toString()) throw new AppError('Only provider can approve', 403);
        if (txn.status !== 'requested') throw new AppError('Transaction is not in requested state', 400);

        txn.status = 'approved';
        txn.timeline.push({ event: 'Booking approved by provider', status: 'approved', timestamp: new Date() });
        await txn.save();

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const lockPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) throw new AppError('Transaction not found', 404);
        if (txn.consumer.toString() !== req.user?._id?.toString()) throw new AppError('Only consumer can lock payment', 403);
        if (txn.status !== 'approved') throw new AppError('Transaction must be approved first', 400);

        txn.status = 'payment_locked';
        txn.escrowAmount = txn.amount;
        txn.timeline.push({ event: 'Payment locked in escrow', status: 'payment_locked', timestamp: new Date() });
        await txn.save();

        await Resource.findByIdAndUpdate(txn.resource, { status: 'booked' });

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const completeTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) throw new AppError('Transaction not found', 404);
        if (txn.provider.toString() !== req.user?._id?.toString()) throw new AppError('Only provider can complete', 403);
        if (txn.status !== 'payment_locked' && txn.status !== 'in_progress') throw new AppError('Invalid state for completion', 400);

        txn.status = 'completed';
        txn.timeline.push({ event: 'Service completed', status: 'completed', timestamp: new Date() });
        await txn.save();

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const releasePayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) throw new AppError('Transaction not found', 404);
        if (txn.consumer.toString() !== req.user?._id?.toString()) throw new AppError('Only consumer can release payment', 403);
        if (txn.status !== 'completed') throw new AppError('Service must be completed first', 400);

        txn.status = 'payment_released';
        txn.timeline.push({ event: 'Payment released to provider', status: 'payment_released', timestamp: new Date() });

        if (req.body.rating) {
            txn.rating = {
                providerRating: req.body.rating,
                review: req.body.review || '',
                consumerRating: 0,
            };
        }

        await txn.save();

        await Resource.findByIdAndUpdate(txn.resource, { status: 'active', $inc: { totalBookings: 1 } });
        await User.findByIdAndUpdate(txn.provider, { $inc: { totalTransactions: 1 } });
        await User.findByIdAndUpdate(txn.consumer, { $inc: { totalTransactions: 1 } });

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const disputeTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id);
        if (!txn) throw new AppError('Transaction not found', 404);

        const userId = req.user?._id?.toString();
        if (txn.provider.toString() !== userId && txn.consumer.toString() !== userId) {
            throw new AppError('Not part of this transaction', 403);
        }

        txn.status = 'disputed';
        txn.dispute = {
            reason: req.body.reason,
            raisedBy: req.user?._id,
            raisedAt: new Date(),
        };
        txn.timeline.push({ event: 'Dispute raised', status: 'disputed', timestamp: new Date(), note: req.body.reason });
        await txn.save();

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        let filter: any = {};

        if (req.user?.role === 'admin') {
            // Admin sees all
        } else if (req.user?.role === 'provider') {
            filter.provider = req.user._id;
        } else {
            filter.consumer = req.user?._id;
        }

        if (req.query.status) filter.status = req.query.status;

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .populate('resource', 'title type images priceModel')
                .populate('provider', 'name company avatar')
                .populate('consumer', 'name company avatar')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Transaction.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: transactions,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const txn = await Transaction.findById(req.params.id)
            .populate('resource')
            .populate('provider', 'name company avatar email phone')
            .populate('consumer', 'name company avatar email phone');

        if (!txn) throw new AppError('Transaction not found', 404);

        res.json({ success: true, data: txn });
    } catch (error: any) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return;
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
