import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a shift name'],
    unique: true,
    trim: true
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time (HH:mm)']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time (HH:mm)']
  },
  workingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;
