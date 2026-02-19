import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IScrapListing extends Document {
    title: string;
    category: 'ferrous_metal' | 'non_ferrous_metal' | 'plastic' | 'rubber' | 'glass' | 'paper' | 'electronic' | 'textile' | 'chemical' | 'other';
    seller: Types.ObjectId;
    description: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    marketRate: number;
    currency: string;
    location: {
        type: string;
        coordinates: [number, number];
        address: string;
        city: string;
        state: string;
    };
    images: string[];
    certifications: string[];
    status: 'available' | 'reserved' | 'sold';
    quality: 'premium' | 'standard' | 'economy';
    minOrderQuantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const scrapListingSchema = new Schema<IScrapListing>(
    {
        title: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['ferrous_metal', 'non_ferrous_metal', 'plastic', 'rubber', 'glass', 'paper', 'electronic', 'textile', 'chemical', 'other'],
            required: true,
        },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true, default: 'kg' },
        pricePerUnit: { type: Number, required: true },
        marketRate: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
        },
        images: [{ type: String }],
        certifications: [{ type: String }],
        status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
        quality: { type: String, enum: ['premium', 'standard', 'economy'], default: 'standard' },
        minOrderQuantity: { type: Number, default: 1 },
    },
    { timestamps: true }
);

scrapListingSchema.index({ category: 1 });
scrapListingSchema.index({ seller: 1 });
scrapListingSchema.index({ status: 1 });
scrapListingSchema.index({ 'location.coordinates': '2dsphere' });
scrapListingSchema.index({ pricePerUnit: 1 });

const ScrapListing: Model<IScrapListing> = mongoose.model<IScrapListing>('ScrapListing', scrapListingSchema);
export default ScrapListing;
