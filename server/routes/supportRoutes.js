import express from 'express';
import { getTickets, createTicket, updateTicketStatus, replyToTicket } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(upload.single('attachment'), createTicket);

router.patch('/:id/status', authorize('SUPER_ADMIN', 'ADMIN'), updateTicketStatus);
router.post('/:id/reply', upload.single('attachment'), replyToTicket);

export default router;
