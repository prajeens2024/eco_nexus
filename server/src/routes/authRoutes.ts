import { Router } from 'express';
import { register, login, getMe, updateProfile, getAllUsers } from '../controllers/authController';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.get('/users', authMiddleware, roleGuard('admin'), getAllUsers);

export default router;
