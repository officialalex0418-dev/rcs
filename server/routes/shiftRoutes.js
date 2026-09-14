import express from 'express';
import { getShifts, createShift, updateShift, deleteShift } from '../controllers/shiftController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getShifts)
  .post(authorize('SUPER_ADMIN', 'ADMIN'), createShift);

router.route('/:id')
  .put(authorize('SUPER_ADMIN', 'ADMIN'), updateShift)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteShift);

export default router;
