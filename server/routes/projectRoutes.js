import express from 'express';
import {
  getProjects, getProject, createProject, updateProject, deleteProject,
  getProjectTasks, createTask
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), updateProject)
  .delete(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), deleteProject);

router.get('/:projectId/tasks', getProjectTasks);
router.post('/:projectId/tasks', authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), createTask);

export default router;
