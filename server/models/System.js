import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  module: String,
  recordId: String,
  details: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  message: String,
  type: {
    type: String,
    enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
    default: 'INFO'
  },
  module: String,
  link: String,
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export const Notification = mongoose.model('Notification', notificationSchema);
