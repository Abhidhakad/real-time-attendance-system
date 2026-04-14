import mongoose from 'mongoose';

const locationSchema = {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
};

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  punchIn: {
    time: {
      type: Date,
      required: true
    },
    selfie: {
      type: String,
      required: true
    },
    location: locationSchema,
    address: {
      type: String,
      default: null
    }
  },

  punchOut: {
    time: Date,
    selfie: String,
    location: locationSchema,
    address: String
  },

  workingHours: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['incomplete', 'completed'],
    default: 'incomplete'
  },

  date: {
    type: Date, // FIXED
    required: true,
    index: true
  }

}, {
  timestamps: true,
  versionKey: false
});


// normalize date (VERY IMPORTANT)
attendanceSchema.pre('save', function (next) {
  if (this.date) {
    const d = new Date(this.date);
    d.setHours(0, 0, 0, 0);
    this.date = d;
  }
  next();
});



attendanceSchema.index({ 'punchIn.location': '2dsphere' });

// prevent multiple attendance per day per user
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });


attendanceSchema.methods.calculateWorkingHours = function () {
  if (this.punchIn?.time && this.punchOut?.time) {
    const diff = this.punchOut.time - this.punchIn.time;
    const hours = diff / (1000 * 60 * 60);

    this.workingHours = Number(hours.toFixed(2));
    this.status = this.workingHours >= 8 ? 'completed' : 'incomplete';
  }

  return this.workingHours;
};


const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;