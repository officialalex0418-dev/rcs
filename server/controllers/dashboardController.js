import Project from '../models/Project.js';
import Inquiry from '../models/Inquiry.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Task from '../models/Task.js';
import Payroll from '../models/Payroll.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      activeProjects,
      totalInquiries,
      openVacancies,
      totalApplications,
      activeTasks,
      payrollSummary
    ] = await Promise.all([
      Project.countDocuments({ status: { $in: ['PLANNING', 'IN_PROGRESS'] } }),
      Inquiry.countDocuments({ status: 'NEW' }),
      Job.countDocuments({ status: 'Active' }),
      Application.countDocuments(),
      Task.countDocuments({ status: { $ne: 'COMPLETED' } }),
      Payroll.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$totalPaid' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeProjects,
        totalInquiries,
        openVacancies,
        totalApplications,
        activeTasks,
        totalPaidPayroll: payrollSummary[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
};
