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

export const deleteUser = async (id, currentUserId) => {
  const user = await userRepository.findById(id);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user._id.toString() === currentUserId?.toString()) {
    const error = new Error('You cannot delete your own account');
    error.statusCode = 400;
    throw error;
  }

  if (user.role === 'admin') {
    const error = new Error('Cannot delete admin users');
    error.statusCode = 400;
    throw error;
  }

  const deletedUser = await userRepository.deleteUser(id);
  logger.info(`User deleted: ${deletedUser.email}`);
  return deletedUser;
};

export const getTeamMembers = async (managerId, filters = {}) => {
  if (filters.isAdmin) {
    const query = { isActive: true, role: 'employee' };
    if (filters.department) query.department = filters.department;
    if (filters.managerId) query.managerId = filters.managerId;
    return await userRepository.findAllWithManager(query);
  }
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

export const getManagers = async () => {
  return await userRepository.findByRole('manager');
};

export const assignToManager = async (employeeId, managerId, currentUserId, currentUserRole) => {
  const employee = await userRepository.findById(employeeId);
  
  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  if (employee.role !== 'employee') {
    const error = new Error('Can only assign employees');
    error.statusCode = 400;
    throw error;
  }

  if (employee._id.toString() === managerId?.toString()) {
    const error = new Error('Employee cannot be their own manager');
    error.statusCode = 400;
    throw error;
  }

  if (managerId) {
    const manager = await userRepository.findById(managerId);
    if (!manager) {
      const error = new Error('Manager not found');
      error.statusCode = 404;
      throw error;
    }
    if (manager.role !== 'manager') {
      const error = new Error('Invalid manager');
      error.statusCode = 400;
      throw error;
    }

    if (currentUserRole !== 'admin' && managerId?.toString() !== currentUserId?.toString()) {
      const error = new Error('You can only assign employees to yourself');
      error.statusCode = 403;
      throw error;
    }
  }

  return await userRepository.update(employeeId, { managerId });
};