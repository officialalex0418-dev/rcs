import Payroll from '../models/Payroll.js';

export const getPayrolls = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('employee').sort('-year -month');
    res.status(200).json({ success: true, data: payrolls });
  } catch (err) {
    next(err);
  }
};

export const processPayroll = async (req, res, next) => {
  try {
    const payroll = await Payroll.create({
      ...req.body,
      processedBy: req.user.id
    });
    res.status(201).json({ success: true, data: payroll });
  } catch (err) {
    next(err);
  }
};

export const updatePayrollStatus = async (req, res, next) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, { status: req.body.status, paymentDate: req.body.status === 'PAID' ? Date.now() : null }, { new: true });
    res.status(200).json({ success: true, data: payroll });
  } catch (err) {
    next(err);
  }
};
