import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getMatchedResources, getPredictedDemand } from '../services/matchingEngine';

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, lat, lng, startDate, endDate, maxBudget, limit } = req.query;

        const results = await getMatchedResources({
            type: type as string,
            lat: lat ? Number(lat) : undefined,
            lng: lng ? Number(lng) : undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            maxBudget: maxBudget ? Number(maxBudget) : undefined,
            limit: limit ? Number(limit) : 10,
        });

        res.json({ success: true, data: results });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDemandPrediction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resourceType, region } = req.query;

        if (!resourceType) {
            res.status(400).json({ success: false, message: 'resourceType is required' });
            return;
        }

        const prediction = await getPredictedDemand(resourceType as string, region as string || '');
        res.json({ success: true, data: prediction });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
