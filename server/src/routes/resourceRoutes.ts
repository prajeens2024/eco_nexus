import { Router } from 'express';
import {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource,
    getMyResources,
    getNearbyResources,
} from '../controllers/resourceController';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.get('/', getResources);
router.get('/nearby', authMiddleware, getNearbyResources);
router.get('/my', authMiddleware, roleGuard('provider', 'admin'), getMyResources);
router.get('/:id', getResourceById);
router.post('/', authMiddleware, roleGuard('provider', 'admin'), createResource);
router.put('/:id', authMiddleware, roleGuard('provider', 'admin'), updateResource);
router.delete('/:id', authMiddleware, roleGuard('provider', 'admin'), deleteResource);

export default router;
