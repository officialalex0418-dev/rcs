import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: String,
  company: String,
  subject: String,
  message: {
    type: String,
    required: true
  },
  service: String,
  budget: String,
  source: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Other'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST', 'CLOSED'],
    default: 'NEW'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followUpDate: Date,
  lastContactedAt: Date,
  notes: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
