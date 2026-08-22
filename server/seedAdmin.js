import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

export const seedAdmin = async () => {
  try {
    const adminEmail = 'laxmi@rcs.com.np';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const superAdmin = new User({
      name: 'Laxmi Super Admin',
      email: adminEmail,
      password: 'L1Ax8i%39043#',
      role: 'SUPER_ADMIN',
      permissions: ['ALL']
    });

    await superAdmin.save();
    console.log('Super Admin created successfully!');
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
};
