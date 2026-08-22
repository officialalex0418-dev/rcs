import express from 'express';
import {
  getProjects, createProject,
  getProjectTasks, createTask
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'));

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .put(updateProject)
  .delete(deleteProject);

router.get('/:projectId/tasks', getProjectTasks);
router.post('/:projectId/tasks', createTask);

export default router;
