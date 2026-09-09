import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { uploadToR2 } from '../utils/r2Storage.js';
import path from 'path';

export const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Use local time for date (Nepal UTC+5:45)
    const localDate = new Date(new Date().getTime() + (5.75 * 60 * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];

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
      const fileName = `attendance/in-${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);
      if (publicUrl) checkInData.checkInSelfie = publicUrl;
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
    // Use local time for date (Nepal UTC+5:45)
    const localDate = new Date(new Date().getTime() + (5.75 * 60 * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out for today' });
    }

    attendance.checkOut = new Date();
    if (req.file) {
      const fileName = `attendance/out-${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);
      if (publicUrl) attendance.checkOutSelfie = publicUrl;
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
