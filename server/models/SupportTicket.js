import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  topic: String,
  description: {
    type: String,
    required: true
  },
  attachment: {
    url: String,
    fileName: String,
    storageKey: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  replies: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    attachment: {
      url: String,
      fileName: String
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;
