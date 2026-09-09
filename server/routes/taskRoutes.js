import express from 'express';
import multer from 'multer';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), createTask);

router.route('/:id')
  .put(upload.single('screenshot'), updateTask)
  .delete(authorize('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER'), deleteTask);

export default router;
