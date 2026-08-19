import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { generateReading, getHistory } from '../controllers/reading.controller.js';

const router = Router();

router.post('/generate', protect, generateReading);
router.get('/history', protect, getHistory);

export default router;