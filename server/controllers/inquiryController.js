import Inquiry from '../models/Inquiry.js';
import { Resend } from 'resend';

// Initialize Resend safely to prevent crash if API key is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
  console.warn('RESEND_API_KEY is missing in inquiryController. Email replies will be disabled.');
}

export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      thread: [{
        sender: 'USER',
        message: req.body.message,
        subject: req.body.subject || 'New Inquiry'
      }]
    });
    res.status(201).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find().sort('-createdAt');
    res.status(200).json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
};

export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const replyToInquiry = async (req, res, next) => {
  try {
    const { message, subject } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    if (!resend) {
      return res.status(500).json({ success: false, message: 'Email service is not configured on the server.' });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'RCS Management <no-reply@rcs.com.np>',
      to: [inquiry.email],
      subject: subject || `Re: ${inquiry.subject}`,
      html: `<div style="font-family: sans-serif; line-height: 1.6;">
              <p>${message}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 12px;">This is a reply to your inquiry from Royal Consultancy Services.</p>
            </div>`
    });

    if (error) {
      return res.status(400).json({ success: false, message: 'Failed to send email', error });
    }

    // Append to thread
    inquiry.thread.push({
      sender: 'ADMIN',
      message,
      subject: subject || `Re: ${inquiry.subject}`
    });
    inquiry.status = 'CONTACTED';
    inquiry.lastContactedAt = Date.now();

    await inquiry.save();

    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

export const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};
