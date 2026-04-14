import mongoose from 'mongoose';
import { User } from '../models/index.js';

export const create = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const findById = async (id, select = '') => {
  if (select) {
    return await User.findById(id).select(select);
  }
  return await User.findById(id);
};

export const findByEmail = async (email, select = '') => {
  return await User.findOne({ email }).select(select);
};

export const findAll = async (query = {}, options = {}) => {
  let { page = 1, limit = 10, sort = '-createdAt' } = options;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('managerId', 'name email'),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findByDepartment = async (department) => {
  return await User.find({ department, isActive: true }).select('-password');
};

export const findByManager = async (managerId) => {
  const objectId = new mongoose.Types.ObjectId(managerId);
  return await User.find({ managerId: objectId, isActive: true }).select('-password');
};

export const update = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).select('-password');
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const count = async (query = {}) => {
  return await User.countDocuments(query);
};

export const findByRole = async (role) => {
  return await User.find({ role, isActive: true }).select('name email department');
};

export const findAllWithManager = async (query) => {
  return await User.find(query)
    .select('-password')
    .populate('managerId', 'name email department');
};