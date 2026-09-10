import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Social Media', 'Search Engine', 'Email', 'Offline', 'Other'],
    required: true
  },
  platform: {
    type: String,
    enum: ['Facebook', 'Instagram', 'Google', 'LinkedIn', 'TikTok', 'YouTube', 'Email', 'Direct', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  budget: {
    type: Number,
    default: 0
  },
  actualSpend: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
