import express from 'express';
import { getTickets, createTicket, updateTicketStatus, replyToTicket } from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(createTicket); // Public or employee

router.use(protect);

router.get('/', authorize('SUPER_ADMIN', 'ADMIN', 'STAFF'), getTickets);
router.patch('/:id/status', authorize('SUPER_ADMIN', 'ADMIN'), updateTicketStatus);
router.post('/:id/reply', replyToTicket);

export default router;
