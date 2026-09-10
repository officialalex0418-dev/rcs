import express from 'express';
import { getCompanyReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/company', getCompanyReport);

export default router;
