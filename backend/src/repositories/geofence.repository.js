import { Geofence } from '../models/index.js';

class GeofenceRepository {
  async create(geofenceData) {
    const geofence = new Geofence({
      name: geofenceData.name,
      center: {
        type: 'Point',
        coordinates: [geofenceData.longitude, geofenceData.latitude]
      },
      radius: geofenceData.radius,
      isActive: geofenceData.isActive ?? true
    });
    return await geofence.save();
  }

  async findById(id) {
    return await Geofence.findById(id);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const [geofences, total] = await Promise.all([
      Geofence.find()
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Geofence.countDocuments()
    ]);

    return {
      geofences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findActive() {
    return await Geofence.find({ isActive: true });
  }

  async update(id, updateData) {
    const updateObj = {};
    
    if (updateData.name) updateObj.name = updateData.name;
    if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
      updateObj.center = {
        type: 'Point',
        coordinates: [updateData.longitude, updateData.latitude]
      };
    }
    if (updateData.radius) updateObj.radius = updateData.radius;
    if (updateData.isActive !== undefined) updateObj.isActive = updateData.isActive;

    return await Geofence.findByIdAndUpdate(id, updateObj, {
      new: true,
      runValidators: true
    });
  }

  async delete(id) {
    return await Geofence.findByIdAndDelete(id);
  }
}

export default new GeofenceRepository();
