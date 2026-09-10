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

export const getHRReport = async (req, res, next) => {
  try {
    const { startDate, endDate, department } = req.query;

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration - 1000);
    const prevEnd = new Date(start.getTime() - 1000);

    const baseFilter = department && department !== 'All' ? { department } : {};
    const dateFilter = { ...baseFilter, createdAt: { $gte: start, $lte: end } };
    const joiningFilter = { ...baseFilter, joiningDate: { $gte: start, $lte: end } };
    const prevJoiningFilter = { ...baseFilter, joiningDate: { $gte: prevStart, $lte: prevEnd } };

    // 1. Summary KPIs
    const fetchHrKpis = async (joinFilter, activeFilter) => {
      const [total, hired, left, vacancies, apps] = await Promise.all([
        User.countDocuments({ role: { $ne: 'SUPER_ADMIN' }, ...activeFilter }),
        User.countDocuments(joinFilter),
        User.countDocuments({ ...baseFilter, employmentStatus: { $in: ['RESIGNED', 'TERMINATED'] }, exitDate: { $gte: start, $lte: end } }),
        Job.countDocuments({ ...baseFilter, status: 'OPEN' }),
        Application.countDocuments({ ...baseFilter, createdAt: { $gte: start, $lte: end } })
      ]);

      const onLeave = await Attendance.countDocuments({ ...baseFilter, date: { $gte: format(start, 'yyyy-MM-dd'), $lte: format(end, 'yyyy-MM-dd') }, status: 'LEAVE' });

      return { total, hired, left, vacancies, apps, onLeave };
    };

    const currentKpis = await fetchHrKpis(joiningFilter, { active: true });
    const previousKpis = await fetchHrKpis(prevJoiningFilter, { active: true });

    // 2. Workforce Trends (Joining vs Leaving)
    const joiningTrend = await User.aggregate([
      { $match: joiningFilter },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$joiningDate' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    // 3. Department Breakdown
    const deptWorkforce = await User.aggregate([
      { $match: { role: { $ne: 'SUPER_ADMIN' }, active: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // 4. Recruitment Funnel
    const funnelStages = await Application.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $in: ['$status', ['SHORTLISTED', 'INTERVIEW_ROUND_1', 'SELECTED', 'HIRED']] }, 1, 0] } },
          interviewed: { $sum: { $cond: [{ $in: ['$status', ['INTERVIEW_ROUND_1', 'INTERVIEW_ROUND_2', 'SELECTED', 'HIRED']] }, 1, 0] } },
          hired: { $sum: { $cond: [{ $eq: ['$status', 'HIRED'] }, 1, 0] } }
        }
      }
    ]);

    // 5. Payroll Overview
    const payrollStats = await Payroll.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'PAID' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPaid' },
          base: { $sum: '$baseSalary' },
          allowance: { $sum: '$otherAllowances' },
          deductions: { $sum: '$taxDeductions' }
        }
      }
    ]);

    // 6. Probation Alerts
    const probationAlerts = await User.find({
      employmentType: 'PROBATION',
      probationUntil: { $lte: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000) }
    }).select('name department designation probationUntil').limit(5);

    // 7. Recent HR Activities (Mock or Real Activity Log if exists)
    // For now using recent hires and status changes
    const recentActivities = await User.find({ ...baseFilter })
      .sort('-updatedAt')
      .limit(8)
      .select('name department updatedAt employmentStatus');

    res.status(200).json({
      success: true,
      data: {
        summary: currentKpis,
        previousSummary: previousKpis,
        trends: { joining: joiningTrend },
        departments: deptWorkforce,
        funnel: funnelStages[0] || { total: 0, shortlisted: 0, interviewed: 0, hired: 0 },
        payroll: payrollStats[0] || { total: 0, base: 0, allowance: 0, deductions: 0 },
        probation: probationAlerts,
        activities: recentActivities
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, salesperson } = req.query;

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration - 1000);
    const prevEnd = new Date(start.getTime() - 1000);

    const baseFilter = salesperson && salesperson !== 'All' ? { assignedTo: salesperson } : {};
    const dateFilter = { ...baseFilter, createdAt: { $gte: start, $lte: end } };
    const prevDateFilter = { ...baseFilter, createdAt: { $gte: prevStart, $lte: prevEnd } };

    // 1. Sales KPIs
    const fetchSalesKpis = async (filter) => {
      const [leads, qualified, won, lost, revenueData] = await Promise.all([
        Inquiry.countDocuments(filter),
        Inquiry.countDocuments({ ...filter, status: { $in: ['QUALIFIED', 'PROPOSAL_SENT', 'WON'] } }),
        Inquiry.countDocuments({ ...filter, status: 'WON' }),
        Inquiry.countDocuments({ ...filter, status: 'LOST' }),
        Project.aggregate([
          { $match: filter },
          { $group: { _id: null, total: { $sum: '$budget' }, count: { $sum: 1 } } }
        ])
      ]);

      return {
        leads,
        qualified,
        won,
        lost,
        revenue: revenueData[0]?.total || 0,
        sales: won // Simplified: won inquiries are sales
      };
    };

    const current = await fetchSalesKpis(dateFilter);
    const previous = await fetchSalesKpis(prevDateFilter);

    // 2. Revenue Trend
    const revenueTrend = await Project.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$budget' } } },
      { $sort: { '_id': 1 } }
    ]);

    // 3. Lead Sources
    const leadSources = await Inquiry.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$source', count: { $sum: 1 }, revenue: { $sum: 0 } } } // Revenue would need join with Project
    ]);

    // 4. Salesperson Performance
    const teamPerformance = await User.aggregate([
      { $match: { role: { $in: ['SALES', 'ADMIN', 'SUPER_ADMIN'] } } },
      {
        $lookup: {
          from: 'inquiries',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'deals'
        }
      },
      {
        $project: {
          name: 1,
          totalDeals: { $size: '$deals' },
          wonDeals: {
            $size: {
              $filter: {
                input: '$deals',
                as: 'd',
                cond: { $eq: ['$$d.status', 'WON'] }
              }
            }
          }
        }
      },
      { $sort: { wonDeals: -1 } }
    ]);

    // 5. Sales Funnel
    const funnel = await Inquiry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          leads: { $sum: 1 },
          qualified: { $sum: { $cond: [{ $in: ['$status', ['QUALIFIED', 'PROPOSAL_SENT', 'WON']] }, 1, 0] } },
          proposal: { $sum: { $cond: [{ $in: ['$status', ['PROPOSAL_SENT', 'WON']] }, 1, 0] } },
          won: { $sum: { $cond: [{ $eq: ['$status', 'WON'] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: current,
        previousSummary: previous,
        revenueTrend,
        leadSources,
        teamPerformance,
        funnel: funnel[0] || { leads: 0, qualified: 0, proposal: 0, won: 0 }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectReport = async (req, res, next) => {
  try {
    const { startDate, endDate, status, department, manager } = req.query;

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration - 1000);
    const prevEnd = new Date(start.getTime() - 1000);

    const baseFilter = {};
    if (status && status !== 'All') baseFilter.status = status;
    if (manager && manager !== 'All') baseFilter.manager = manager;

    const dateFilter = { ...baseFilter, createdAt: { $gte: start, $lte: end } };
    const prevDateFilter = { ...baseFilter, createdAt: { $gte: prevStart, $lte: prevEnd } };

    // 1. Project KPIs
    const fetchProjectKpis = async (filter) => {
      const [total, active, completed, delayed, atRisk, totalBudget] = await Promise.all([
        Project.countDocuments(filter),
        Project.countDocuments({ ...filter, status: { $in: ['IN_PROGRESS', 'PLANNING'] } }),
        Project.countDocuments({ ...filter, status: 'COMPLETED' }),
        Project.countDocuments({ ...filter, health: 'DELAYED' }),
        Project.countDocuments({ ...filter, health: 'AT_RISK' }),
        Project.aggregate([
          { $match: filter },
          { $group: { _id: null, total: { $sum: '$budget' } } }
        ])
      ]);

      return {
        total,
        active,
        completed,
        delayed,
        atRisk,
        budget: totalBudget[0]?.total || 0
      };
    };

    const current = await fetchProjectKpis(dateFilter);
    const previous = await fetchProjectKpis(prevDateFilter);

    // 2. Project Creation Trend
    const creationTrend = await Project.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    // 3. Status Distribution
    const statusDistribution = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 4. Task Analytics
    const taskStats = await Task.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
          overdue: { $sum: { $cond: [{ $and: [{ $lt: ['$dueDate', new Date()] }, { $ne: ['$status', 'COMPLETED'] }] }, 1, 0] } }
        }
      }
    ]);

    // 5. Manager Performance
    const managerPerformance = await User.aggregate([
      { $match: { role: 'PROJECT_MANAGER' } },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: 'manager',
          as: 'projects'
        }
      },
      {
        $project: {
          name: 1,
          count: { $size: '$projects' },
          avgProgress: { $avg: '$projects.progress' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 6. Upcoming Deadlines
    const upcomingDeadlines = await Project.find({
      status: { $ne: 'COMPLETED' },
      targetDate: { $gte: new Date(), $lte: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) }
    })
    .select('name client targetDate progress status')
    .sort('targetDate')
    .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: current,
        previousSummary: previous,
        trends: creationTrend,
        statusDistribution,
        tasks: taskStats[0] || { total: 0, completed: 0, overdue: 0 },
        managers: managerPerformance,
        deadlines: upcomingDeadlines
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getFinanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    const duration = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - duration - 1000);
    const prevEnd = new Date(start.getTime() - 1000);

    // 1. Finance KPIs
    const fetchFinanceKpis = async (s, e) => {
      const projects = await Project.aggregate([
        { $match: { createdAt: { $gte: s, $lte: e } } },
        { $group: { _id: null, revenue: { $sum: '$budget' }, count: { $sum: 1 } } }
      ]);

      const payroll = await Payroll.aggregate([
        { $match: { createdAt: { $gte: s, $lte: e }, status: 'PAID' } },
        { $group: { _id: null, expense: { $sum: '$totalPaid' }, base: { $sum: '$baseSalary' }, bonus: { $sum: '$bonus' } } }
      ]);

      const rev = projects[0]?.revenue || 0;
      const exp = payroll[0]?.expense || 0;

      return {
        revenue: rev,
        expense: exp,
        profit: rev - exp,
        margin: rev ? Math.round(((rev - exp) / rev) * 100) : 0,
        payroll: payroll[0] || { total: 0, base: 0, bonus: 0 }
      };
    };

    const current = await fetchFinanceKpis(start, end);
    const previous = await fetchFinanceKpis(prevStart, prevEnd);

    // 2. Revenue vs Expense Trend
    const trend = await Project.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$budget' } } },
      { $sort: { '_id': 1 } }
    ]);

    // 3. Project Profitability
    const projectProfits = await Project.find({ createdAt: { $gte: start, $lte: end } })
      .select('name client budget status progress')
      .sort('-budget')
      .limit(10);

    // 4. Client Revenue
    const clientRevenue = await Project.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$client', revenue: { $sum: '$budget' }, projects: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: current,
        previousSummary: previous,
        trends: trend,
        projectProfits,
        clientRevenue
      }
    });
  } catch (err) {
    next(err);
  }
};
