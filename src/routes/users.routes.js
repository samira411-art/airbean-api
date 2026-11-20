import express from 'express';
import { signup, login, getOrderHistory } from '../controllers/users.controller.js';
import { checkIdParams, checkUser } from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', checkUser, signup);
router.post('/login', checkUser, login);
router.get('/:userId/orders', checkIdParams, getOrderHistory);

export default router;
