import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { checkCompatibility } from '../controllers/compatibility.controller.js';

const router = Router();

router.post('/check', protect, checkCompatibility);

export default router;