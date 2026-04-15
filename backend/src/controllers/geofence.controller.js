import { geofenceService } from '../services/index.js';

export const create = async (req, res, next) => {
  try {
    const geofence = await geofenceService.create(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: 'Geofence created successfully',
      data: { geofence }
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await geofenceService.getAll({ page, limit });

    res.json({
      success: true,
      data: result.geofences,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const geofence = await geofenceService.getById(req.params.id);

    res.json({
      success: true,
      data: { geofence }
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const geofence = await geofenceService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Geofence updated successfully',
      data: { geofence }
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await geofenceService.remove(req.params.id);

    res.json({
      success: true,
      message: 'Geofence deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};