import express from 'express';
import { createCart, getCart, addItem, removeItem } from '../controllers/cart.controller.js';
import { checkIdParams, checkCart, checkCartItem } from '../middleware/validate.js';

const router = express.Router();

router.post('/', checkCart, createCart);
router.get('/:cartId', checkIdParams, getCart);
router.post('/:cartId/items', checkIdParams, checkCartItem, addItem);
router.delete('/:cartId/items/:id', checkIdParams, removeItem);

export default router;
