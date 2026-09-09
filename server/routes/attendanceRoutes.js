import express from 'express';
import multer from 'multer';
import { checkIn, checkOut, getMyAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);

router.post('/check-in', upload.single('selfie'), checkIn);
router.post('/check-out', upload.single('selfie'), checkOut);
router.get('/my-logs', getMyAttendance);

export default router;
