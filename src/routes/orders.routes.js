import express from 'express';
import { createOrder, getOrder } from '../controllers/orders.controller.js';
import { checkIdParams, checkOrder } from '../middleware/validate.js';

const router = express.Router();

router.post('/', checkOrder, createOrder);
router.get('/:orderId', checkIdParams, getOrder);

export default router;
