import express from 'express';
import {
  getJobs, createJob, updateJob, deleteJob,
  applyForJob, getApplications, updateApplicationStatus
} from '../controllers/careerController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/jobs', getJobs);
router.post('/apply', upload.single('resume'), applyForJob);

// Protected admin routes
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER'));

router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getApplications);
router.patch('/applications/:id/status', updateApplicationStatus);

export default router;
