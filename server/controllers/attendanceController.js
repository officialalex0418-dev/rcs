import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

export const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in
    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Already checked in for today' });
    }

    const checkInData = {
      user: userId,
      date: today,
      checkIn: new Date(),
      status: 'PRESENT',
      biometricVerified: req.body.biometricVerified || false
    };

    if (req.file) {
      checkInData.checkInSelfie = `/uploads/attendance/${req.file.filename}`;
    }

    if (!attendance) {
      attendance = await Attendance.create(checkInData);
    } else {
      attendance.checkIn = checkInData.checkIn;
      attendance.checkInSelfie = checkInData.checkInSelfie;
      attendance.biometricVerified = checkInData.biometricVerified;
      await attendance.save();
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out for today' });
    }

    attendance.checkOut = new Date();
    if (req.file) {
      attendance.checkOutSelfie = `/uploads/attendance/${req.file.filename}`;
    }

    await attendance.save();
    res.status(200).json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logs = await Attendance.find({ user: userId }).sort('-date');

    // Calculate stats
    const stats = logs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 });

    res.status(200).json({ success: true, data: logs, stats });
  } catch (err) {
    next(err);
  }
};
