import express from 'express';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDepartments)
  .post(authorize('SUPER_ADMIN', 'ADMIN'), createDepartment);

router.route('/:id')
  .put(authorize('SUPER_ADMIN', 'ADMIN'), updateDepartment)
  .delete(authorize('SUPER_ADMIN', 'ADMIN'), deleteDepartment);

export default router;
