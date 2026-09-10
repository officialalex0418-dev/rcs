import express from 'express';
import { getCompanyReport, getHRReport, getSalesReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/company', getCompanyReport);
router.get('/hr', getHRReport);
router.get('/sales', getSalesReport);
router.get('/projects', getProjectReport);
router.get('/finance', getFinanceReport);
router.get('/marketing', getMarketingReport);

export default router;
