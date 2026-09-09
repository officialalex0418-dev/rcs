import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { login, getMe, updatePassword, updateMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-me', protect, upload.single('profilePicture'), updateMe);

export default router;
