import User from '../models/User.js';
import crypto from 'crypto';
import { sendOnboardingEmail } from '../utils/emailService.js';

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
    // Generate RCS ID
    const lastUser = await User.findOne({ employeeId: /^RCS/ }).sort({ employeeId: -1 });
    let newId = 'RCS001';
    if (lastUser && lastUser.employeeId) {
      const currentNum = parseInt(lastUser.employeeId.replace('RCS', ''));
      newId = `RCS${(currentNum + 1).toString().padStart(3, '0')}`;
    }

    // Generate secure 12-character random temporary password
    const tempPassword = crypto.randomBytes(9).toString('base64').replace(/\+/g, '0').replace(/\//g, '1');

    const employee = await User.create({
      ...req.body,
      employeeId: newId,
      password: tempPassword,
      mustChangePassword: true
    });

    // Send onboarding email
    await sendOnboardingEmail(employee.email, employee.name, tempPassword);

    // Hide password in response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json({ success: true, data: employeeResponse });
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
