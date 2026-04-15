import { geofenceRepository } from '../repositories/index.js';
import logger from '../config/logger.js';

export const create = async (geofenceData, adminId) => {
  const geofence = await geofenceRepository.create(geofenceData, adminId);
  logger.info(`Geofence created: ${geofence.name} by admin ${adminId}`);
  return geofence;
};

export const getAll = async (options) => {
  return await geofenceRepository.findAll(options);
};

export const getActive = async () => {
  return await geofenceRepository.findActive();
};

export const getById = async (id) => {
  const geofence = await geofenceRepository.findById(id);
  if (!geofence) {
    const error = new Error('Geofence not found');
    error.statusCode = 404;
    throw error;
  }
  return geofence;
};

export const update = async (id, updateData) => {
  const geofence = await geofenceRepository.update(id, updateData);
  if (!geofence) {
    const error = new Error('Geofence not found');
    error.statusCode = 404;
    throw error;
  }
  logger.info(`Geofence updated: ${geofence.name}`);
  return geofence;
};

export const remove = async (id) => {
  const geofence = await geofenceRepository.remove(id);
  if (!geofence) {
    const error = new Error('Geofence not found');
    error.statusCode = 404;
    throw error;
  }
  logger.info(`Geofence deleted: ${geofence.name}`);
  return geofence;
};