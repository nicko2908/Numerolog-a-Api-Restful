import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { calculateProfile, getProfile } from '../controllers/numerology.controller.js';

const router = Router();

router.post('/calculate', protect, calculateProfile);
router.get('/profile', protect, getProfile);

export default router;