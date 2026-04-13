import { attendanceRepository, userRepository, geofenceRepository } from '../repositories/index.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { isWithinRadius } from '../utils/geolocation.js';
import { getTodayDateString, formatDate } from '../utils/date.js';
import logger from '../config/logger.js';

class AttendanceService {
  async punchIn(userId, punchInData) {
    const today = getTodayDateString();

    const existingAttendance = await attendanceRepository.findByUserAndDate(userId, today);
    if (existingAttendance) {
      const error = new Error('Already punched in today');
      error.statusCode = 400;
      throw error;
    }

    const activeGeofences = await geofenceRepository.findActive();
    if (activeGeofences.length > 0) {
      const isWithinGeofence = activeGeofences.some(geofence => {
        const [geofenceLng, geofenceLat] = geofence.center.coordinates;
        return isWithinRadius(
          punchInData.latitude,
          punchInData.longitude,
          geofenceLat,
          geofenceLng,
          geofence.radius
        );
      });

      if (!isWithinGeofence) {
        const error = new Error('You are outside the designated work area');
        error.statusCode = 400;
        throw error;
      }
    }

    const selfieUpload = await uploadToCloudinary(punchInData.selfie, 'attendance/selfies');

    const attendanceData = {
      userId,
      date: today,
      isPunchIn: true,
      punchIn: {
        time: new Date(),
        selfie: selfieUpload.url,
        location: {
          type: 'Point',
          coordinates: [punchInData.longitude, punchInData.latitude]
        },
        address: punchInData.address || null
      }
    };

    const attendance = await attendanceRepository.create(attendanceData);
    logger.info(`Punch in recorded for user ${userId} at ${today}`);

    return attendance;
  }

  async punchOut(userId, punchOutData) {
    const today = getTodayDateString();

    const attendance = await attendanceRepository.findByUserAndDate(userId, today);
    if (!attendance) {
      const error = new Error('No punch-in record found for today');
      error.statusCode = 400;
      throw error;
    }

    if (attendance.punchOut?.time) {
      const error = new Error('Already punched out today');
      error.statusCode = 400;
      throw error;
    }

    const selfieUpload = await uploadToCloudinary(punchOutData.selfie, 'attendance/selfies');

    const updateData = {
      punchOut: {
        time: new Date(),
        selfie: selfieUpload.url,
        location: {
          type: 'Point',
          coordinates: [punchOutData.longitude, punchOutData.latitude]
        },
        address: punchOutData.address || null
      }
    };

    const updatedAttendance = await attendanceRepository.update(attendance._id, updateData);
    updatedAttendance.calculateWorkingHours();
    await updatedAttendance.save();

    logger.info(`Punch out recorded for user ${userId} at ${today}`);

    return updatedAttendance;
  }

  async getTodayAttendance(userId) {
    const today = getTodayDateString();
    return await attendanceRepository.findByUserAndDate(userId, today);
  }

  async getMyAttendance(userId, query, options) {
    const queryObj = {};
    
    if (query.startDate && query.endDate) {
      queryObj.date = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.status) {
      queryObj.status = query.status;
    }

    return await attendanceRepository.findByUser(userId, queryObj, options);
  }

  async getTeamAttendance(managerId, query, options) {
    const teamMembers = await userRepository.findByManager(managerId);
    const teamUserIds = teamMembers.map(m => m._id);

    const queryObj = {};
    if (query.startDate && query.endDate) {
      queryObj.date = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.status) {
      queryObj.status = query.status;
    }

    return await attendanceRepository.findByTeam(teamUserIds, queryObj, options);
  }

  async getAllAttendance(query, options) {
    const queryObj = {};
    
    if (query.startDate && query.endDate) {
      queryObj.date = { $gte: query.startDate, $lte: query.endDate };
    }
    if (query.status) {
      queryObj.status = query.status;
    }
    if (query.userId) {
      queryObj.userId = query.userId;
    }

    return await attendanceRepository.findAll(queryObj, options);
  }

  async getAttendanceById(id) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      const error = new Error('Attendance record not found');
      error.statusCode = 404;
      throw error;
    }
    return attendance;
  }

  async getMyStats(userId, startDate, endDate) {
    return await attendanceRepository.getStatsByUser(userId, startDate, endDate);
  }

  async getDailyStats(date = getTodayDateString()) {
    return await attendanceRepository.getDailyStats(date);
  }

  async getMonthlyStats(year, month) {
    return await attendanceRepository.getMonthlyStats(year, month);
  }

  async generateReport(query) {
    const { startDate, endDate, userId, page = 1, limit = 50 } = query;

    const queryObj = {};
    if (startDate && endDate) {
      queryObj.date = { $gte: startDate, $lte: endDate };
    }
    if (userId) {
      queryObj.userId = userId;
    }

    return await attendanceRepository.findAll(queryObj, { page, limit, sort: 'date' });
  }
}

export default new AttendanceService();
