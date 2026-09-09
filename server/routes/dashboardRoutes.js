import express from 'express';
import { getDashboardStats, getEmployeeDashboardData } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('SUPER_ADMIN', 'ADMIN'), getDashboardStats);
router.get('/employee', getEmployeeDashboardData);

export default router;
