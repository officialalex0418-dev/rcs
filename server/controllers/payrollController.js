import Payroll from '../models/Payroll.js';
import User from '../models/User.js';

export const getPayrolls = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('employee processedBy').sort('-year -month');
    res.status(200).json({ success: true, data: payrolls });
  } catch (err) {
    next(err);
  }
};

export const processPayroll = async (req, res, next) => {
  try {
    const {
      employee, month, year, baseSalary, dailyAllowance,
      daysWorked, bonus, leaveDeductions, taxDeductions,
      otherAllowances, manualTotalPaid
    } = req.body;

    // Automated Calculation Logic
    const allowanceTotal = (dailyAllowance * daysWorked) + otherAllowances;
    const deductionsTotal = leaveDeductions + taxDeductions;
    const calculatedTotal = (baseSalary + allowanceTotal + bonus) - deductionsTotal;

    // Use manual total if provided, otherwise use calculated
    const totalPaid = manualTotalPaid !== undefined ? manualTotalPaid : calculatedTotal;

    const payroll = await Payroll.create({
      employee,
      month,
      year,
      baseSalary,
      dailyAllowance,
      daysWorked,
      bonus,
      leaveDeductions,
      taxDeductions,
      otherAllowances,
      totalPaid,
      processedBy: req.user.id
    });

    res.status(201).json({ success: true, data: payroll });
  } catch (err) {
    next(err);
  }
};

export const updatePayrollStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      {
        status,
        paymentDate: status === 'PAID' ? Date.now() : null
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: payroll });
  } catch (err) {
    next(err);
  }
};
