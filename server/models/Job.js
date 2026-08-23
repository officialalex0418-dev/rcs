import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  department: String,
  location: String,
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
    default: 'Full-time'
  },
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  experienceLevel: String,
  salaryRange: String,
  salaryVisible: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [String],
  requirements: [String],
  benefits: [String],
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft', 'Archived'],
    default: 'Active'
  },
  deadline: Date,
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
