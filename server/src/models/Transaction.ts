import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type TransactionStatus =
    | 'requested'
    | 'approved'
    | 'payment_locked'
    | 'in_progress'
    | 'completed'
    | 'payment_released'
    | 'disputed'
    | 'cancelled';

export interface ITransaction extends Document {
    resource: Types.ObjectId;
    provider: Types.ObjectId;
    consumer: Types.ObjectId;
    status: TransactionStatus;
    amount: number;
    escrowAmount: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    timeline: {
        event: string;
        status: TransactionStatus;
        timestamp: Date;
        note?: string;
    }[];
    dispute?: {
        reason: string;
        raisedBy: Types.ObjectId;
        raisedAt: Date;
        resolvedAt?: Date;
        resolution?: string;
    };
    rating?: {
        providerRating: number;
        consumerRating: number;
        review?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
        provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        consumer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['requested', 'approved', 'payment_locked', 'in_progress', 'completed', 'payment_released', 'disputed', 'cancelled'],
            default: 'requested',
        },
        amount: { type: Number, required: true },
        escrowAmount: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        timeline: [
            {
                event: { type: String, required: true },
                status: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                note: { type: String },
            },
        ],
        dispute: {
            reason: { type: String },
            raisedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            raisedAt: { type: Date },
            resolvedAt: { type: Date },
            resolution: { type: String },
        },
        rating: {
            providerRating: { type: Number, min: 1, max: 5 },
            consumerRating: { type: Number, min: 1, max: 5 },
            review: { type: String },
        },
    },
    { timestamps: true }
);

transactionSchema.index({ provider: 1 });
transactionSchema.index({ consumer: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ resource: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
