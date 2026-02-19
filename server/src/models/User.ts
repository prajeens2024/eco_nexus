import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'provider' | 'consumer' | 'admin';
    company: string;
    phone?: string;
    avatar?: string;
    location: {
        type: string;
        coordinates: [number, number];
        address: string;
        city: string;
        state: string;
    };
    reputation: number;
    totalTransactions: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        role: { type: String, enum: ['provider', 'consumer', 'admin'], required: true, default: 'consumer' },
        company: { type: String, required: true, trim: true },
        phone: { type: String },
        avatar: { type: String },
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] },
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
        },
        reputation: { type: Number, default: 5.0, min: 0, max: 5 },
        totalTransactions: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
