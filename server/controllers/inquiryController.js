import Inquiry from '../models/Inquiry.js';

export const createInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
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

export const updateInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};
