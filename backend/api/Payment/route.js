import express from 'express';
import { processPayment, getPaymentStatus } from '../../controllers/paymentController.js';

const router = express.Router();

router.post('/', processPayment);
router.get('/status/:id', getPaymentStatus);

export default router;