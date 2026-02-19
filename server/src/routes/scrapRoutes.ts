import { Router } from 'express';
import {
    createScrapListing,
    getScrapListings,
    getScrapById,
    updateScrapListing,
    deleteScrapListing,
    getMarketRates,
    getScrapTrends,
} from '../controllers/scrapController';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.get('/', getScrapListings);
router.get('/market-rates', getMarketRates);
router.get('/trends', getScrapTrends);
router.get('/:id', getScrapById);
router.post('/', authMiddleware, roleGuard('provider', 'admin'), createScrapListing);
router.put('/:id', authMiddleware, roleGuard('provider', 'admin'), updateScrapListing);
router.delete('/:id', authMiddleware, roleGuard('provider', 'admin'), deleteScrapListing);

export default router;
