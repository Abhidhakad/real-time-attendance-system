import mongoose from 'mongoose';

const geofenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  center: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Center coordinates are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]'
      }
    }
  },
  radius: {
    type: Number,
    required: [true, 'Radius is required'],
    min: [10, 'Minimum radius is 10 meters'],
    max: [50000, 'Maximum radius is 50 kilometers']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// geospatial index
geofenceSchema.index({ 'center': '2dsphere' });

const Geofence = mongoose.model('Geofence', geofenceSchema);

export default Geofence;
