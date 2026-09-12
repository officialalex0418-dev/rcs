import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['BUSINESS', 'FUNCTIONAL', 'NON_FUNCTIONAL', 'TECHNICAL'], default: 'FUNCTIONAL' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'IMPLEMENTED'], default: 'PENDING' },
  acceptanceCriteria: String
});

const deliverableSchema = new mongoose.Schema({
  name: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], default: 'NOT_STARTED' }
});

const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'], default: 'UPCOMING' },
  progress: { type: Number, default: 0 }
});

const riskSchema = new mongoose.Schema({
  title: String,
  category: { type: String, enum: ['TECHNICAL', 'FINANCIAL', 'RESOURCE', 'TIMELINE', 'CLIENT', 'OPERATIONAL'], default: 'TECHNICAL' },
  probability: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  impact: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  mitigationPlan: String,
  status: { type: String, enum: ['OPEN', 'MITIGATED', 'CLOSED'], default: 'OPEN' }
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  client: String,
  clientRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' }, // Linking to potential client/inquiry
  description: String,
  status: {
    type: String,
    enum: ['DRAFT', 'PLANNING', 'APPROVAL_PENDING', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'AT_RISK', 'COMPLETED', 'CANCELLED', 'CLOSED'],
    default: 'DRAFT'
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
  department: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  team: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    allocation: { type: Number, default: 100 } // percentage
  }],

  startDate: Date,
  targetDate: Date,
  actualEndDate: Date,

  // Scope
  objectives: String,
  inScope: [String],
  outOfScope: [String],
  requirements: [requirementSchema],
  deliverables: [deliverableSchema],

  // Financials
  budget: {
    total: { type: Number, default: 0 },
    breakdown: {
      employee: { type: Number, default: 0 },
      infrastructure: { type: Number, default: 0 },
      software: { type: Number, default: 0 },
      contingency: { type: Number, default: 0 }
    },
    actualSpend: { type: Number, default: 0 }
  },
  revenue: { type: Number, default: 0 },

  // Planning
  milestones: [milestoneSchema],
  risks: [riskSchema],

  progress: { type: Number, min: 0, max: 100, default: 0 },

  // Readiness/Completeness
  readinessScore: { type: Number, default: 0 },

  // Legacy/Compatibility fields
  extraFields: [{ label: String, value: String }],
  mediaGallery: [{ type: { type: String, enum: ['IMAGE', 'VIDEO'] }, url: String, publicId: String }],
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
