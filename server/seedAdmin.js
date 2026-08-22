import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rcs_db';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'laxmi@rcs.com.np';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
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
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
