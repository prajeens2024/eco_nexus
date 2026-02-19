import { Router } from 'express';
import {
    getDashboardStats,
    getUtilizationData,
    getRevenueTimeline,
    getEnvironmentalImpact,
    getTopPerformers,
    getRecentActivity,
} from '../controllers/analyticsController';
import { getRecommendations, getDemandPrediction } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/utilization', getUtilizationData);
router.get('/revenue', getRevenueTimeline);
router.get('/environmental', getEnvironmentalImpact);
router.get('/top-performers', getTopPerformers);
router.get('/recent-activity', getRecentActivity);
router.get('/recommendations', getRecommendations);
router.get('/predictions', getDemandPrediction);

export default router;
