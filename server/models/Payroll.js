import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentDate: Date,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
