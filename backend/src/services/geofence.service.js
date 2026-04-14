import { geofenceRepository } from '../repositories/index.js';
import logger from '../config/logger.js';

class GeofenceService {
  async create(geofenceData, adminId) {
    const geofence = await geofenceRepository.create(geofenceData, adminId);
    logger.info(`Geofence created: ${geofence.name} by admin ${adminId}`);
    return geofence;
  }

  async getAll(options) {
    return await geofenceRepository.findAll(options);
  }

  async getActive() {
    return await geofenceRepository.findActive();
  }

  async getById(id) {
    const geofence = await geofenceRepository.findById(id);
    if (!geofence) {
      const error = new Error('Geofence not found');
      error.statusCode = 404;
      throw error;
    }
    return geofence;
  }

  async update(id, updateData) {
    const geofence = await geofenceRepository.update(id, updateData);
    if (!geofence) {
      const error = new Error('Geofence not found');
      error.statusCode = 404;
      throw error;
    }
    logger.info(`Geofence updated: ${geofence.name}`);
    return geofence;
  }

  async delete(id) {
    const geofence = await geofenceRepository.delete(id);
    if (!geofence) {
      const error = new Error('Geofence not found');
      error.statusCode = 404;
      throw error;
    }
    logger.info(`Geofence deleted: ${geofence.name}`);
    return geofence;
  }
}

export default new GeofenceService();
