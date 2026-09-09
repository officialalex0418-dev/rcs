import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { sendThankYouEmail, sendOnboardingEmail } from '../utils/emailService.js';

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication failed. User ID missing.' });
    }

    const jobData = { ...req.body, createdBy: req.user.id };
    const job = await Job.create(jobData);

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A job with this title already exists.' });
    }

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
    const applicationData = { ...req.body };

    if (req.file) {
      applicationData.resume = {
        url: `/uploads/resumes/${req.file.filename}`,
        fileName: req.file.originalname,
        storageKey: req.file.filename
      };
    }

    const application = await Application.create(applicationData);

    // Fetch job details to get the title for the email
    const job = await Job.findById(application.job);
    const jobTitle = job ? job.title : 'Position';

    // Send Thank You Email in background
    sendThankYouEmail(application.email, `${application.firstName} ${application.lastName}`, jobTitle)
      .catch(err => console.error('Error sending application thank you email:', err));

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.job && req.query.job !== '') filters.job = req.query.job;
    if (req.query.status && req.query.status !== '') filters.status = req.query.status;

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
        // Generate RCS ID
        const lastUser = await User.findOne({ employeeId: /^RCS/ }).sort({ employeeId: -1 });
        let newId = 'RCS001';
        if (lastUser && lastUser.employeeId) {
          const currentNum = parseInt(lastUser.employeeId.replace('RCS', ''));
          newId = `RCS${(currentNum + 1).toString().padStart(3, '0')}`;
        }

        // Generate secure 12-char password
        generatedPassword = crypto.randomBytes(9).toString('base64').replace(/\+/g, '0').replace(/\//g, '1');
        const designation = application.job?.title || 'Team Member';

        await User.create({
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          password: generatedPassword,
          employeeId: newId,
          role: 'STAFF',
          designation: designation,
          phone: application.phone,
          mustChangePassword: true
        });

        // Send Onboarding Email from HR
        sendOnboardingEmail(application.email, `${application.firstName} ${application.lastName}`, generatedPassword, designation)
          .catch(err => console.error('Error sending hiring onboarding email:', err));
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
