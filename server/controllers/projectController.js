import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort('-createdAt');
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const getProjectTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).sort('dueDate');
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, project: req.params.projectId });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};
