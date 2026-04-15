import { Overtime } from '../models/index.js';

export const create = async (overtimeData) => {
  const overtime = new Overtime(overtimeData);
  return await overtime.save();
};

export const findById = async (id) => {
  return await Overtime.findById(id)
    .populate('userId', 'name email department')
    .populate('approvedBy', 'name');
};

export const findByUser = async (userId, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    Overtime.find({ userId })
      .populate('userId', 'name email department')
      .populate('approvedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Overtime.countDocuments({ userId })
  ]);

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findPending = async (options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    Overtime.find({ status: 'pending' })
      .populate('userId', 'name email department')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Overtime.countDocuments({ status: 'pending' })
  ]);

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findPendingForTeam = async (teamUserIds, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    Overtime.find({ userId: { $in: teamUserIds }, status: 'pending' })
      .populate('userId', 'name email department')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Overtime.countDocuments({ userId: { $in: teamUserIds }, status: 'pending' })
  ]);

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findByTeam = async (teamUserIds, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt', status } = options;
  const skip = (page - 1) * limit;

  const query = { userId: { $in: teamUserIds } };
  if (status) {
    query.status = status;
  }

  const [requests, total] = await Promise.all([
    Overtime.find(query)
      .populate('userId', 'name email department managerId')
      .populate('approvedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Overtime.countDocuments(query)
  ]);

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findAll = async (query = {}, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    Overtime.find(query)
      .populate('userId', 'name email department')
      .populate('approvedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Overtime.countDocuments(query)
  ]);

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const update = async (id, updateData) => {
  return await Overtime.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })
    .populate('userId', 'name email department')
    .populate('approvedBy', 'name');
};

export const existsForUserAndDate = async (userId, date) => {
  const existingDate = new Date(date);
  const startOfDay = new Date(existingDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(existingDate.setHours(23, 59, 59, 999));

  return await Overtime.findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
};