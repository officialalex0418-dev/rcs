import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadToR2 } from '../utils/r2Storage.js';
import path from 'path';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          ...user.toObject(),
          mustChangePassword: user.mustChangePassword
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword, user.password))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { phone, address } = req.body;
    const updateData = {};

    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (req.file) {
      const fileName = `profiles/profile-${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);

      if (publicUrl) {
        updateData.profilePicture = publicUrl;
        console.log('--- SAVING PROFILE PICTURE TO R2 ---');
        console.log('User ID:', req.user.id);
        console.log('URL:', publicUrl);
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    console.log('SUCCESS: Profile updated for', user.name);

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (err) {
    console.error('ERROR in updateMe:', err);
    next(err);
  }
};
