import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  checkIn: Date,
  checkOut: Date,
  checkInSelfie: String,
  checkOutSelfie: String,
  biometricVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE', 'LEAVE'],
    default: 'PRESENT'
  },
  location: {
    type: String,
    default: 'Office'
  },
  notes: String
}, {
  timestamps: true
});

// Index for faster lookups
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
