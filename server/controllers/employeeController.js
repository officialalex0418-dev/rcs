import User from '../models/User.js';

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({ role: { $ne: 'SUPER_ADMIN' } }).sort('-createdAt');
    res.status(200).json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const employee = await User.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, message: 'Employee deleted' });
  } catch (err) {
    next(err);
  }
};
