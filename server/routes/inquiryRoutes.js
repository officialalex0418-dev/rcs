import express from 'express';
import { createInquiry, getInquiries, getInquiryById, replyToInquiry, updateInquiry } from '../controllers/inquiryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', createInquiry);

// Protected routes
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'SALES'));

router.get('/', getInquiries);
router.get('/:id', getInquiryById);
router.post('/:id/reply', replyToInquiry);
router.patch('/:id', updateInquiry);

export default router;
