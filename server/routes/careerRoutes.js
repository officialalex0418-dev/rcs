import express from 'express';
import {
  getJobs, createJob, updateJob,
  applyForJob, getApplications, updateApplicationStatus
} from '../controllers/careerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/jobs', getJobs);
router.post('/apply', applyForJob);

// Protected admin routes
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'));

router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.get('/applications', getApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

export default router;
