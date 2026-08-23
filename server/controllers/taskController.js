import Task from '../models/Task.js';

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

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, progress },
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
