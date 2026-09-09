import express from 'express';
import multer from 'multer';
import { login, getMe, updatePassword, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Use memory storage for R2 uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-me', protect, upload.single('profilePicture'), updateMe);

export default router;
