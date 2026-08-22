import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), createTask);

router.route('/:id')
  .put(updateTask)
  .delete(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), deleteTask);

export default router;
