export interface User {
    _id: string;
    name: string;
    email: string;
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
    createdAt: string;
    updatedAt: string;
}

export interface Resource {
    _id: string;
    title: string;
    type: 'machine' | 'labor' | 'warehouse' | 'scrap';
    owner: User | string;
    description: string;
    specifications: Record<string, string>;
    capacity: { value: number; unit: string };
    location: {
        type: string;
        coordinates: [number, number];
        address: string;
        city: string;
        state: string;
    };
    availability: { dayOfWeek: number; startTime: string; endTime: string }[];
    availableFrom: string;
    availableTo: string;
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
    createdAt: string;
    updatedAt: string;
}

export type TransactionStatus =
    | 'requested'
    | 'approved'
    | 'payment_locked'
    | 'in_progress'
    | 'completed'
    | 'payment_released'
    | 'disputed'
    | 'cancelled';

export interface Transaction {
    _id: string;
    resource: Resource | string;
    provider: User | string;
    consumer: User | string;
    status: TransactionStatus;
    amount: number;
    escrowAmount: number;
    currency: string;
    startDate: string;
    endDate: string;
    timeline: {
        event: string;
        status: TransactionStatus;
        timestamp: string;
        note?: string;
    }[];
    dispute?: {
        reason: string;
        raisedBy: string;
        raisedAt: string;
        resolvedAt?: string;
        resolution?: string;
    };
    rating?: {
        providerRating: number;
        consumerRating: number;
        review?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ScrapListing {
    _id: string;
    title: string;
    category: string;
    seller: User | string;
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
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalResources: number;
    activeResources: number;
    idleResources: number;
    totalTransactions: number;
    completedTransactions: number;
    pendingTransactions: number;
    totalRevenue: number;
    avgTransactionValue: number;
    totalUsers: number;
    totalScrapListings: number;
    utilizationRate: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface MatchScore {
    resourceId: string;
    resource: Resource;
    score: number;
    breakdown: {
        proximityScore: number;
        availabilityScore: number;
        costScore: number;
        reputationScore: number;
        sustainabilityScore: number;
    };
}
