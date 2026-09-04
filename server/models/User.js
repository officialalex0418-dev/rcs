import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'SALES', 'PROJECT_MANAGER', 'CONTENT_MANAGER', 'DEVELOPER', 'DESIGNER', 'STAFF'],
    default: 'STAFF'
  },
  mustChangePassword: {
    type: Boolean,
    default: true
  },
  designation: String,
  phone: String,
  address: String,
  panNumber: String,
  employeeId: {
    type: String,
    unique: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  basicSalary: {
    type: Number,
    default: 0
  },
  dailyAllowance: {
    type: Number,
    default: 0
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  permissions: [{
    type: String
  }],
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
