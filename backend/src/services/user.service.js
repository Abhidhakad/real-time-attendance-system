import { userRepository } from '../repositories/index.js';
import logger from '../config/logger.js';




export const getAllUsers = async (query, options) => {
  return await userRepository.findAll(query, options);
};

export const getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUser = async (id, updateData) => {
  const allowedFields = ['name', 'email', 'department', 'role'];

  const filteredData = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    const error = new Error('No valid fields provided for update');
    error.statusCode = 400;
    throw error;
  }

  if (filteredData.role) {
    const validRoles = ['employee', 'manager', 'admin'];

    if (!validRoles.includes(filteredData.role)) {
      const error = new Error('Invalid role value');
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await userRepository.update(id, filteredData);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`User updated: ${user.email}`);

  return user;
};

export const deleteUser = async (id) => {
  const user = await userRepository.delete(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  logger.info(`User deleted: ${user.email}`);
  return user;
};

export const getTeamMembers = async (managerId) => {
  return await userRepository.findByManager(managerId);
};

export const getUsersByDepartment = async (department) => {
  return await userRepository.findByDepartment(department);
};

export const getStats = async () => {
  const [total, employees, managers, admins] = await Promise.all([
    userRepository.count({}),
    userRepository.count({ role: 'employee' }),
    userRepository.count({ role: 'manager' }),
    userRepository.count({ role: 'admin' })
  ]);

  return { total, employees, managers, admins };
};