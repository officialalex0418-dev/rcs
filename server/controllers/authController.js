import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
      data: { user }
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
