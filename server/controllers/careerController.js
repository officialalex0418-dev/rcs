import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
