import express from 'express';
import { login, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

export default router;
