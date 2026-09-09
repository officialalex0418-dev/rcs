import Task from '../models/Task.js';
import { uploadToR2 } from '../utils/r2Storage.js';
import path from 'path';

export const getTasks = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filters).populate('assignedTo project').sort('-createdAt');
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { subtasks } = req.body;
    let progress = req.body.progress;

    // Auto-calculate progress if subtasks are provided
    if (subtasks && subtasks.length > 0) {
      const completedCount = subtasks.filter(st => st.completed).length;
      progress = Math.round((completedCount / subtasks.length) * 100);
    }

    const updateData = { ...req.body, progress };

    if (req.file) {
      const fileName = `tasks/task-${req.params.id}-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);
      if (publicUrl) updateData.outputScreenshot = publicUrl;
    }

    if (req.body.status === 'COMPLETED') {
      updateData.completedAt = new Date();
      updateData.progress = 100;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
