import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'COMPLETED'],
    default: 'TODO'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  dueDate: Date,
  subtasks: [{
    title: String,
    completed: { type: Boolean, default: false }
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completedAt: Date
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
