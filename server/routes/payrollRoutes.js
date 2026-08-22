import express from 'express';
import { getPayrolls, processPayroll, updatePayrollStatus } from '../controllers/payrollController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'));

router.route('/')
  .get(getPayrolls)
  .post(processPayroll);

router.route('/:id/status')
  .patch(updatePayrollStatus);

export default router;
