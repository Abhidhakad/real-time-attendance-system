import { geofenceService } from '../services/index.js';

class GeofenceController {
  async create(req, res, next) {
    try {
      const geofence = await geofenceService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Geofence created successfully',
        data: { geofence }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
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
  }

  async getById(req, res, next) {
    try {
      const geofence = await geofenceService.getById(req.params.id);

      res.json({
        success: true,
        data: { geofence }
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
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
  }

  async delete(req, res, next) {
    try {
      await geofenceService.delete(req.params.id);

      res.json({
        success: true,
        message: 'Geofence deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GeofenceController();
