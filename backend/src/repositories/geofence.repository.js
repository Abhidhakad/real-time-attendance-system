import { Geofence } from '../models/index.js';

export const create = async (geofenceData, adminId) => {
  const geofence = new Geofence({
    name: geofenceData.name,
    center: {
      type: 'Point',
      coordinates: [geofenceData.longitude, geofenceData.latitude]
    },
    radius: geofenceData.radius,
    isActive: geofenceData.isActive ?? true,
    createdBy: adminId
  });
  return await geofence.save();
};

export const findById = async (id) => {
  return await Geofence.findById(id).populate('createdBy', 'name email');
};

export const findAll = async (options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [geofences, total] = await Promise.all([
    Geofence.find()
      .populate('createdBy', 'name email')
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
};

export const findActive = async () => {
  return await Geofence.find({ isActive: true });
};

export const update = async (id, updateData) => {
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
  }).populate('createdBy', 'name email');
};

export const remove = async (id) => {
  return await Geofence.findByIdAndDelete(id);
};