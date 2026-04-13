import { userRepository } from '../repositories/index.js';
import { generateToken } from '../utils/jwt.js';
import logger from '../config/logger.js';

// AuthService handles all authentication-related logic, including registration, login, profile management, and password changes.

export const register = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);

  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.create(userData);

  const token = generateToken(user._id);

  logger.info(`New user registered: ${user.email}`);

  return { user, token };
};


export const login = async (email, password) => {

  const user = await userRepository.findByEmail(email, '+password');

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account is deactivated');
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(user._id);

  logger.info(`User logged in: ${user.email}`);

  return { user, token };
};

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};


export const updateProfile = async (userId, updateData) => {
  const user = await userRepository.update(userId, updateData);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  logger.info(`Profile updated: ${user.email}`);

  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await userRepository.findById(userId, '+password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  return true;
};

