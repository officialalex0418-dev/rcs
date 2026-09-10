import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Inquiry from '../models/Inquiry.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Payroll from '../models/Payroll.js';
import Task from '../models/Task.js';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format, isWithinInterval } from 'date-fns';

export const getCompanyReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    // Previous equivalent period for trend comparison
    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration - 1000);
    const prevEnd = new Date(start.getTime() - 1000);

    const dateFilter = { createdAt: { $gte: start, $lte: end } };
    const prevDateFilter = { createdAt: { $gte: prevStart, $lte: prevEnd } };

    // 1. Top KPI Cards Data
    const fetchKpis = async (filter) => {
      const [jobs, apps, hired, inquiries, sales, projects, lost] = await Promise.all([
        Job.countDocuments({ ...filter, status: 'OPEN' }),
        Application.countDocuments(filter),
        Application.countDocuments({ ...filter, status: 'HIRED' }),
        Inquiry.countDocuments(filter),
        Inquiry.countDocuments({ ...filter, status: 'WON' }),
        Project.countDocuments(filter),
        Inquiry.countDocuments({ ...filter, status: 'LOST' })
      ]);

      // Calculate revenue from projects created in this period
      const projectRevenue = await Project.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$budget' } } }
      ]);

      return { jobs, apps, hired, inquiries, sales, projects, lost, revenue: projectRevenue[0]?.total || 0 };
    };

    const currentKpis = await fetchKpis(dateFilter);
    const previousKpis = await fetchKpis(prevDateFilter);

    // 2. Business Performance Trend (Daily/Weekly/Monthly depending on range)
    // For now, let's group by month if range > 60 days, else by day
    const isLargeRange = duration > 60 * 24 * 60 * 60 * 1000;

    const trendData = await Project.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: isLargeRange ? { $month: '$createdAt' } : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          projects: { $sum: 1 },
          revenue: { $sum: '$budget' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // 3. Department Contribution
    const deptContribution = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // 4. Application Analytics
    const appAnalytics = await Job.aggregate([
      { $match: { status: 'OPEN' } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'apps'
        }
      },
      {
        $project: {
          title: 1,
          totalApps: { $size: '$apps' },
          hired: {
            $size: {
              $filter: {
                input: '$apps',
                as: 'app',
                cond: { $eq: ['$$app.status', 'HIRED'] }
              }
            }
          }
        }
      },
      { $sort: { totalApps: -1 } },
      { $limit: 10 }
    ]);

    // 5. Recent Hires
    const recentHires = await User.find({ joiningDate: { $gte: start, $lte: end } })
      .select('name designation department joiningDate profilePicture')
      .sort('-joiningDate')
      .limit(5);

    // 6. Employee Performance
    const employeePerformance = await User.aggregate([
      { $match: { role: { $ne: 'SUPER_ADMIN' } } },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'tasks'
        }
      },
      {
        $project: {
          name: 1,
          department: 1,
          taskCount: { $size: '$tasks' },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'COMPLETED'] }
              }
            }
          }
        }
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 10 }
    ]);

    // 7. Project Progress
    const projects = await Project.find(dateFilter)
      .select('name client progress status health budget')
      .sort('-createdAt');

    // 8. Financial Overview
    const payrollExpense = await Payroll.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$totalPaid' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          current: currentKpis,
          previous: previousKpis
        },
        trends: trendData,
        departments: deptContribution,
        applicationAnalytics: appAnalytics,
        recentHires,
        employeePerformance,
        projects,
        finance: {
          revenue: currentKpis.revenue,
          expense: payrollExpense[0]?.total || 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
};
