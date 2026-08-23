import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  client: String,
  description: String,
  status: {
    type: String,
    enum: ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'],
    default: 'PLANNING'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  health: {
    type: String,
    enum: ['ON_TRACK', 'AT_RISK', 'DELAYED', 'BLOCKED'],
    default: 'ON_TRACK'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: Date,
  targetDate: Date,
  budget: Number,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  // Dynamic Business Sarthi Fields
  extraFields: [{
    label: String,
    value: String
  }],
  mediaGallery: [{
    type: { type: String, enum: ['IMAGE', 'VIDEO'] },
    url: String,
    publicId: String
  }],
  // Public Portfolio Connection
  publicPortfolio: {
    showPublic: { type: Boolean, default: false },
    slug: String,
    category: String,
    technologies: [String],
    thumbnail: String,
    gallery: [String],
    caseStudy: String
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
