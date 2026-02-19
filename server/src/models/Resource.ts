import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAvailabilityWindow {
    dayOfWeek: number; // 0-6
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
}

export interface IResource extends Document {
    title: string;
    type: 'machine' | 'labor' | 'warehouse' | 'scrap';
    owner: Types.ObjectId;
    description: string;
    specifications: Record<string, string>;
    capacity: {
        value: number;
        unit: string;
    };
    location: {
        type: string;
        coordinates: [number, number];
        address: string;
        city: string;
        state: string;
    };
    availability: IAvailabilityWindow[];
    availableFrom: Date;
    availableTo: Date;
    priceModel: {
        type: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'per-unit' | 'negotiable';
        amount: number;
        currency: string;
    };
    images: string[];
    sustainabilityScore: number;
    status: 'active' | 'booked' | 'maintenance' | 'inactive';
    totalBookings: number;
    avgRating: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
    {
        title: { type: String, required: true, trim: true },
        type: { type: String, enum: ['machine', 'labor', 'warehouse', 'scrap'], required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        specifications: { type: Map, of: String, default: {} },
        capacity: {
            value: { type: Number, required: true },
            unit: { type: String, required: true },
        },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
        },
        availability: [
            {
                dayOfWeek: { type: Number, min: 0, max: 6 },
                startTime: { type: String },
                endTime: { type: String },
            },
        ],
        availableFrom: { type: Date, required: true },
        availableTo: { type: Date, required: true },
        priceModel: {
            type: { type: String, enum: ['hourly', 'daily', 'weekly', 'monthly', 'per-unit', 'negotiable'], required: true },
            amount: { type: Number, required: true },
            currency: { type: String, default: 'INR' },
        },
        images: [{ type: String }],
        sustainabilityScore: { type: Number, default: 0, min: 0, max: 100 },
        status: { type: String, enum: ['active', 'booked', 'maintenance', 'inactive'], default: 'active' },
        totalBookings: { type: Number, default: 0 },
        avgRating: { type: Number, default: 0 },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

resourceSchema.index({ type: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ owner: 1 });
resourceSchema.index({ 'location.coordinates': '2dsphere' });
resourceSchema.index({ 'priceModel.amount': 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ title: 'text', description: 'text' });

const Resource: Model<IResource> = mongoose.model<IResource>('Resource', resourceSchema);
export default Resource;
