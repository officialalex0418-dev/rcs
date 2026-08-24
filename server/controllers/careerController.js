import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { Resend } from 'resend';

// Initialize Resend safely to prevent crash if API key is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
  console.warn('RESEND_API_KEY is missing. Email features will be disabled.');
}

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
    console.log('--- NEW VACANCY PUBLISH ATTEMPT ---');
    console.log('Auth User ID:', req.user?.id);
    console.log('Payload:', JSON.stringify(req.body, null, 2));

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication failed. User ID missing.' });
    }

    const jobData = { ...req.body, createdBy: req.user.id };

    const job = await Job.create(jobData);

    console.log('SUCCESS: Job created with ID:', job._id);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    console.error('ERROR in createJob:', err);

    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    // Check for duplicate slug
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A job with this title already exists. Please try a different title.' });
    }

    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    console.log('Updating job', req.params.id, 'with body:', req.body);
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    console.log('Job updated successfully:', job._id);
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('Error in updateJob:', err);
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
    console.log('--- NEW JOB APPLICATION ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const applicationData = { ...req.body };

    if (req.file) {
      applicationData.resume = {
        url: `/uploads/resumes/${req.file.filename}`,
        fileName: req.file.originalname,
        storageKey: req.file.filename
      };
    }

    const application = await Application.create(applicationData);
    console.log('SUCCESS: Application saved with ID:', application._id);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    console.error('ERROR in applyForJob:', err);
    next(err);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.job && req.query.job !== '') filters.job = req.query.job;
    if (req.query.status && req.query.status !== '') filters.status = req.query.status;

    console.log('Fetching applications with filters:', filters);

    const applications = await Application.find(filters).populate('job').sort('-createdAt');
    console.log(`Found ${applications.length} applications`);

    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    console.error('ERROR in getApplications:', err);
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

        generatedPassword = crypto.randomBytes(4).toString('hex'); // 8 char password

        await User.create({
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          password: generatedPassword,
          employeeId: newId,
          role: 'STAFF',
          designation: application.job?.title || 'Team Member',
          phone: application.phone
        });

        // Send email via Resend
        try {
          if (resend) {
            await resend.emails.send({
              from: 'RCS Careers <careers@rcs.com.np>',
              to: [application.email],
              subject: 'Welcome to Royal Consultancy Services - Your Portal Credentials',
              html: `<div style="font-family: sans-serif; line-height: 1.6;">
                      <h2>Congratulations!</h2>
                      <p>You have been hired as <strong>${application.job?.title || 'a Team Member'}</strong> at Royal Consultancy Services.</p>
                      <p>Your staff portal account has been created. Use the credentials below to login:</p>
                      <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> ${application.email}</p>
                        <p style="margin: 0;"><strong>Password:</strong> ${generatedPassword}</p>
                        <p style="margin: 0;"><strong>Employee ID:</strong> ${newId}</p>
                      </div>
                      <p>Please change your password after your first login.</p>
                      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                      <p style="color: #666; font-size: 12px;">This is an automated onboarding email from RCS Management.</p>
                    </div>`
            });
          } else {
            console.error('Failed to send hiring email: Resend is not configured (missing API key)');
          }
        } catch (emailErr) {
          console.error('Failed to send hiring email:', emailErr);
        }
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
