import { Attendance } from '../models/index.js';

class AttendanceRepository {
  async create(attendanceData) {
    const attendance = new Attendance(attendanceData);
    return await attendance.save();
  }

  async findById(id) {
    return await Attendance.findById(id).populate('userId', 'name email department');
  }

  async findByUserAndDate(userId, date) {
    return await Attendance.findOne({ userId, date });
  }

  async findByUser(userId, query = {}, options = {}) {
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
  }

  async findByTeam(teamUserIds, query = {}, options = {}) {
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
  }

  async findAll(query = {}, options = {}) {
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
  }

  async update(id, updateData) {
    return await Attendance.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('userId', 'name email department');
  }

  async getStatsByUser(userId, startDate, endDate) {
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
  }

  async getDailyStats(date) {
    return await Attendance.aggregate([
      { $match: { date } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getMonthlyStats(year, month) {
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
  }
}

export default new AttendanceRepository();
