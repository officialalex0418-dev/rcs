import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Jobs
export const getJobs = async (req, res, next) => {
  try {
    const filters = req.query.admin ? {} : { status: 'Active' };
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

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, message: 'Job deleted' });
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
    const filters = {};
    if (req.query.job) filters.job = req.query.job;
    if (req.query.status) filters.status = req.query.status;

    const applications = await Application.find(filters).populate('job').sort('-createdAt');
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;

    let generatedPassword = null;

    // Handle Hired Status: Create User Account
    if (status === 'HIRED') {
      const existingUser = await User.findOne({ email: application.email });

      if (!existingUser) {
        generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 char password

        await User.create({
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          password: generatedPassword,
          role: 'STAFF',
          designation: application.job.title,
          phone: application.phone
        });

        // TODO: Integrate Resend API to send email
        console.log(`Email sent to ${application.email} with password: ${generatedPassword}`);
      }
    }

    await application.save();

    res.status(200).json({
      success: true,
      data: application,
      credentials: generatedPassword ? { email: application.email, password: generatedPassword } : undefined
    });
  } catch (err) {
    next(err);
  }
};

