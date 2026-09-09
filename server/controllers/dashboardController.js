import User from '../models/User.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import Attendance from '../models/Attendance.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const employeeCount = await User.countDocuments({ role: { $ne: 'SUPER_ADMIN' } });
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    const projectCount = await Project.countDocuments();

    // Get recent applications
    const recentApplications = await Application.find()
      .populate('job', 'title')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          employees: employeeCount,
          jobs: jobCount,
          applications: applicationCount,
          projects: projectCount
        },
        recentApplications
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const employees = await User.find({ role: { $ne: 'SUPER_ADMIN' } })
      .select('name designation profilePicture')
      .sort('-basicSalary'); // Simple mock ranking logic based on something

    const leaderboard = employees.map((emp, index) => ({
      ...emp.toObject(),
      rank: `#${index + 1}`,
      score: (9.5 - (index * 0.2)).toFixed(1) // Mock dynamic scores
    }));

    res.status(200).json({ success: true, data: leaderboard });
  } catch (err) {
    next(err);
  }
};

export const getEmployeeDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get Nepal date (YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' });
    const localDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }));
    const startOfMonth = new Date(localDate.getFullYear(), localDate.getMonth(), 1).toLocaleDateString('en-CA');

    // 1. User Info
    const user = await User.findById(userId).select('-password');

    // 2. Attendance Stats
    const todayAttendance = await Attendance.findOne({ user: userId, date: today });
    const monthlyAttendance = await Attendance.countDocuments({
      user: userId,
      date: { $gte: startOfMonth.toISOString().split('T')[0] },
      status: 'PRESENT'
    });

    // 3. Task Stats
    const tasks = await Task.find({ assignedTo: userId, status: { $ne: 'COMPLETED' } })
      .populate('project', 'name')
      .sort('-createdAt')
      .limit(5);

    const tasksCount = await Task.countDocuments({ assignedTo: userId });
    const completedTasksCount = await Task.countDocuments({ assignedTo: userId, status: 'COMPLETED' });

    // 4. Project Progress
    const projects = await Project.find({ team: userId })
      .select('name progress status')
      .limit(3);

    // 5. Mock KPIs and Scoreboard (Real apps would calculate this from activity logs)
    const scoreboard = {
      score: 8.7,
      breakdown: {
        codeQuality: 9.2,
        taskCompletion: 8.5,
        collaboration: 8.8,
        innovation: 8.3
      },
      rank: "#2",
      status: "Top Performer"
    };

    const kpis = {
      tasksCompleted: completedTasksCount,
      onTimeDelivery: "92%",
      bugResolution: 18,
      codeReviews: 31
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          todayAttendance: todayAttendance ? {
            status: todayAttendance.status,
            checkIn: todayAttendance.checkIn,
            checkOut: todayAttendance.checkOut
          } : null,
          monthlyAttendance: {
            present: monthlyAttendance,
            total: 24 // Mock total working days
          },
          salary: {
            amount: user.basicSalary || 0,
            nextPayout: "Oct 01" // Mock
          },
          rank: scoreboard.rank
        },
        scoreboard,
        progress: {
          overall: 78, // Mock calculation
          projects
        },
        tasks,
        kpis,
        upcomingEvents: [ // Mock
          { title: "Project Deadline", date: "Sep 15, 2025", type: "DEADLINE" },
          { title: "Team Meeting", date: "Aug 28, 2025", type: "MEETING" }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};
