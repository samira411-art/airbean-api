import express from 'express';
import { getMenu, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/menu.controller.js';
import { checkIdParams, checkProduct } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/:id', checkIdParams, getProduct);
router.post('/', checkProduct, createProduct);
router.put('/:id', checkIdParams, checkProduct, updateProduct);
router.delete('/:id', checkIdParams, deleteProduct);

export default router;
