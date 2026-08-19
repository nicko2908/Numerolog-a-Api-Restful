import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getMe, updateMe, updatePassword } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, updatePassword);

export default router;