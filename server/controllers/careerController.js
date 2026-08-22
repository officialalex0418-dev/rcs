import Job from '../models/Job.js';
import Application from '../models/Application.js';

// Jobs
export const getJobs = async (req, res, next) => {
  try {
    const filters = req.query.admin ? {} : { status: 'Published' };
    const jobs = await Job.find(filters).sort('-createdAt');
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// Applications
export const applyForJob = async (req, res, next) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find().populate('job').sort('-createdAt');
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};
