import { Router } from 'express';
import {
    createTransaction,
    approveTransaction,
    lockPayment,
    completeTransaction,
    releasePayment,
    disputeTransaction,
    getTransactions,
    getTransactionById,
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id/approve', approveTransaction);
router.put('/:id/lock-payment', lockPayment);
router.put('/:id/complete', completeTransaction);
router.put('/:id/release', releasePayment);
router.put('/:id/dispute', disputeTransaction);

export default router;
