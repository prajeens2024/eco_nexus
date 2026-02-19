import Resource from '../models/Resource';
import Transaction from '../models/Transaction';

interface MatchScore {
    resourceId: string;
    resource: any;
    score: number;
    breakdown: {
        proximityScore: number;
        availabilityScore: number;
        costScore: number;
        reputationScore: number;
        sustainabilityScore: number;
    };
}

// Haversine distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculateProximityScore(distance: number, maxDistance: number = 100): number {
    if (distance >= maxDistance) return 0;
    return Math.round((1 - distance / maxDistance) * 100);
}

function calculateAvailabilityOverlap(
    resourceFrom: Date,
    resourceTo: Date,
    requestedFrom: Date,
    requestedTo: Date
): number {
    const overlapStart = Math.max(resourceFrom.getTime(), requestedFrom.getTime());
    const overlapEnd = Math.min(resourceTo.getTime(), requestedTo.getTime());
    if (overlapEnd <= overlapStart) return 0;
    const requestedDuration = requestedTo.getTime() - requestedFrom.getTime();
    if (requestedDuration <= 0) return 0;
    return Math.round(((overlapEnd - overlapStart) / requestedDuration) * 100);
}

function calculateCostScore(resourcePrice: number, avgPrice: number): number {
    if (avgPrice === 0) return 50;
    const ratio = resourcePrice / avgPrice;
    if (ratio <= 0.5) return 100;
    if (ratio >= 2) return 0;
    return Math.round((1 - (ratio - 0.5) / 1.5) * 100);
}

export const MATCH_WEIGHTS = {
    proximity: 0.30,
    availability: 0.25,
    cost: 0.25,
    reputation: 0.10,
    sustainability: 0.10,
};

export async function getMatchedResources(params: {
    type?: string;
    lat?: number;
    lng?: number;
    startDate?: Date;
    endDate?: Date;
    maxBudget?: number;
    limit?: number;
}): Promise<MatchScore[]> {
    const { type, lat, lng, startDate, endDate, maxBudget, limit = 10 } = params;

    const filter: any = { status: 'active' };
    if (type) filter.type = type;
    if (maxBudget) filter['priceModel.amount'] = { $lte: maxBudget };

    const resources = await Resource.find(filter)
        .populate('owner', 'name company reputation avatar')
        .limit(50);

    // Get average price for cost scoring
    const avgPriceAgg = await Resource.aggregate([
        { $match: filter },
        { $group: { _id: null, avg: { $avg: '$priceModel.amount' } } },
    ]);
    const avgPrice = avgPriceAgg[0]?.avg || 1;

    const scored: MatchScore[] = resources.map((resource) => {
        // Proximity score
        let proximityScore = 50; // default if no coordinates
        if (lat && lng && resource.location?.coordinates?.length === 2) {
            const [rLng, rLat] = resource.location.coordinates;
            const distance = haversineDistance(lat, lng, rLat, rLng);
            proximityScore = calculateProximityScore(distance);
        }

        // Availability score
        let availabilityScore = 50;
        if (startDate && endDate) {
            availabilityScore = calculateAvailabilityOverlap(
                resource.availableFrom,
                resource.availableTo,
                startDate,
                endDate
            );
        }

        // Cost score
        const costScore = calculateCostScore(resource.priceModel.amount, avgPrice);

        // Reputation score
        const owner = resource.owner as any;
        const reputationScore = owner?.reputation ? Math.round((owner.reputation / 5) * 100) : 50;

        // Sustainability score
        const sustainabilityScore = resource.sustainabilityScore || 50;

        // Composite weighted score
        const score = Math.round(
            proximityScore * MATCH_WEIGHTS.proximity +
            availabilityScore * MATCH_WEIGHTS.availability +
            costScore * MATCH_WEIGHTS.cost +
            reputationScore * MATCH_WEIGHTS.reputation +
            sustainabilityScore * MATCH_WEIGHTS.sustainability
        );

        return {
            resourceId: resource._id as string,
            resource,
            score,
            breakdown: {
                proximityScore,
                availabilityScore,
                costScore,
                reputationScore,
                sustainabilityScore,
            },
        };
    });

    // Sort by score descending and return top results
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
}

export async function getPredictedDemand(resourceType: string, region: string): Promise<any> {
    // Simple regression-based prediction using historical transaction data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

    const historicalData = await Transaction.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                status: { $in: ['payment_released', 'completed'] },
            },
        },
        {
            $lookup: {
                from: 'resources',
                localField: 'resource',
                foreignField: '_id',
                as: 'resourceDetails',
            },
        },
        { $unwind: '$resourceDetails' },
        {
            $match: {
                'resourceDetails.type': resourceType,
                ...(region ? { 'resourceDetails.location.city': new RegExp(region, 'i') } : {}),
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                revenue: { $sum: '$amount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Simple linear regression for prediction
    const n = historicalData.length;
    if (n < 2) {
        return {
            predicted: 'insufficient_data',
            confidence: 0,
            suggestion: 'Not enough historical data for prediction. List more resources to generate insights.',
            historical: historicalData,
        };
    }

    const xValues = historicalData.map((_: any, i: number) => i);
    const yValues = historicalData.map((d: any) => d.count);
    const xMean = xValues.reduce((a: number, b: number) => a + b, 0) / n;
    const yMean = yValues.reduce((a: number, b: number) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        denominator += (xValues[i] - xMean) ** 2;
    }

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    // Predict for next 7 days
    const predictions = Array.from({ length: 7 }, (_, i) => {
        const x = n + i;
        const predicted = Math.max(0, Math.round(slope * x + intercept));
        return {
            date: new Date(Date.now() + (i + 1) * 86400000).toISOString().split('T')[0],
            predictedDemand: predicted,
        };
    });

    const avgPredicted = predictions.reduce((sum, p) => sum + p.predictedDemand, 0) / 7;
    const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable';
    const confidence = Math.min(0.95, 0.5 + n * 0.015);

    let suggestion = '';
    if (trend === 'increasing') {
        suggestion = `Demand for ${resourceType} is trending upward in ${region || 'your area'}. Consider listing additional capacity now.`;
    } else if (trend === 'decreasing') {
        suggestion = `Demand for ${resourceType} is declining. Consider offering promotional pricing to attract bookings.`;
    } else {
        suggestion = `Demand is stable. Maintain current listings and pricing strategy.`;
    }

    return {
        resourceType,
        region,
        trend,
        confidence: +confidence.toFixed(2),
        avgPredictedDemand: Math.round(avgPredicted),
        predictions,
        suggestion,
        historical: historicalData,
    };
}
