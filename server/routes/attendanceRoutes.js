import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { checkIn, checkOut, getMyAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/attendance');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.use(protect);

router.post('/check-in', upload.single('selfie'), checkIn);
router.post('/check-out', upload.single('selfie'), checkOut);
router.get('/my-logs', getMyAttendance);

export default router;
