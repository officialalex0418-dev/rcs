import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: String,
  resume: {
    url: String,
    storageKey: String,
    fileName: String
  },
  portfolioUrl: String,
  linkedInUrl: String,
  githubUrl: String,
  coverLetter: String,
  status: {
    type: String,
    enum: ['NEW', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN'],
    default: 'NEW'
  },
  notes: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  interviews: [{
    type: { type: String, enum: ['PHONE', 'TECHNICAL', 'HR', 'FINAL'] },
    date: Date,
    location: String,
    notes: String,
    status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' }
  }]
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
