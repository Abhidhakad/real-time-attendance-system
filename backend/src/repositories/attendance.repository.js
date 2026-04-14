import { Attendance } from '../models/index.js';

export const create = async (attendanceData) => {
  const attendance = new Attendance(attendanceData);
  return await attendance.save();
};

export const findById = async (id) => {
  return await Attendance.findById(id).populate('userId', 'name email department');
};

export const findByUserAndDate = async (userId, dateString) => {
  const startOfDay = new Date(dateString);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(dateString);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await Attendance.findOne({ 
    userId, 
    date: { $gte: startOfDay, $lte: endOfDay }
  });
};

export const findByUser = async (userId, query = {}, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Attendance.find({ userId, ...query })
      .populate('userId', 'name email department')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments({ userId, ...query })
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const findByTeam = async (teamUserIds, query = {}, options = {}) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Attendance.find({ userId: { $in: teamUserIds }, ...query })
      .populate('userId', 'name email department')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments({ userId: { $in: teamUserIds }, ...query })
  ]);

  return {
    records,
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

  const [records, total] = await Promise.all([
    Attendance.find(query)
      .populate('userId', 'name email department')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(query)
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const update = async (id, updateData) => {
  return await Attendance.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('userId', 'name email department');
};

export const getStatsByUser = async (userId, startDate, endDate) => {
  const matchStage = { userId };
  if (startDate && endDate) {
    matchStage.date = { $gte: startDate, $lte: endDate };
  }

  return await Attendance.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalHours: { $sum: '$workingHours' }
      }
    }
  ]);
};

export const getDailyStats = async (date) => {
  return await Attendance.aggregate([
    { $match: { date } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

export const getMonthlyStats = async (year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  return await Attendance.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { userId: '$userId', status: '$status' },
        count: { $sum: 1 },
        totalHours: { $sum: '$workingHours' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id.userId',
        userName: '$user.name',
        status: '$_id.status',
        count: 1,
        totalHours: 1
      }
    }
  ]);
};

export const getDailyStatsByTeam = async (teamUserIds, date) => {
  return await Attendance.aggregate([
    { $match: { userId: { $in: teamUserIds }, date } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

export const getMonthlyStatsByTeam = async (teamUserIds, year, month) => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  return await Attendance.aggregate([
    {
      $match: {
        userId: { $in: teamUserIds },
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: { userId: '$userId', status: '$status' },
        count: { $sum: 1 },
        totalHours: { $sum: '$workingHours' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id.userId',
        userName: '$user.name',
        status: '$_id.status',
        count: 1,
        totalHours: 1
      }
    }
  ]);
};