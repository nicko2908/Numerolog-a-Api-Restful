import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    metodo: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      required: true,
    },
    status_code: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, 
    },
  },
  { timestamps: false } 
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;