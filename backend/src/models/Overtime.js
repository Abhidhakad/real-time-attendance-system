import mongoose from 'mongoose';

const overtimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  requestedHours: {
    type: Number,
    required: [true, 'Requested hours is required'],
    min: [0.5, 'Minimum overtime is 0.5 hours'],
    max: [12, 'Maximum overtime is 12 hours']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  remarks: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

overtimeSchema.index({ userId: 1, date: 1 });
overtimeSchema.index({ status: 1 });

const Overtime = mongoose.model('Overtime', overtimeSchema);

export default Overtime;
