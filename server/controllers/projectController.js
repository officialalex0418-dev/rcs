import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getProjects = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.employeeId) {
      filters.$or = [
        { manager: req.query.employeeId },
        { 'team.user': req.query.employeeId }
      ];
    }

    const projects = await Project.find(filters)
      .populate('manager team.user')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager team.user stakeholders decisions.decidedBy documents.uploadedBy changeRequests.requestedBy changeRequests.reviewedBy issues.owner testLogs.tester');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, data: project });
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

export const updateProject = async (req, res, next) => {
  try {
    const projectToUpdate = await Project.findById(req.params.id);
    if (!projectToUpdate) return res.status(404).json({ success: false, message: 'Project not found' });

    // Authorization check: Admin or assigned Manager
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);
    const isManager = projectToUpdate.manager && projectToUpdate.manager.toString() === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this project' });
    }

    const updateData = { ...req.body };

    // Auto-calculate progress based on milestones if milestones are being updated
    if (req.body.milestones && req.body.milestones.length > 0) {
      const completedMilestones = req.body.milestones.filter(ms => ms.status === 'COMPLETED').length;
      updateData.progress = Math.round((completedMilestones / req.body.milestones.length) * 100);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Authorization check: Admin or assigned Manager
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);
    const isManager = project.manager && project.manager.toString() === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this project' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

export const getProjectTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo dependsOn').sort('dueDate');
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};


export const createTask = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Authorization check: Admin or assigned Manager
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);
    const isManager = project.manager && project.manager.toString() === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'You are not authorized to add tasks to this project' });
    }

    const { subtasks } = req.body;
    let progress = 0;

    if (subtasks && subtasks.length > 0) {
      const completedCount = subtasks.filter(st => st.completed).length;
      progress = Math.round((completedCount / subtasks.length) * 100);
    }

    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
      progress: req.body.progress || progress
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};
