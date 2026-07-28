import express from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getStats);

export default router;
