import { attendanceService } from '../services/index.js';

class AttendanceController {
  async punchIn(req, res, next) {
    try {
      const attendance = await attendanceService.punchIn(req.user._id, req.body);

      res.status(201).json({
        success: true,
        message: 'Punch in successful',
        data: { attendance }
      });
    } catch (error) {
      next(error);
    }
  }

  async punchOut(req, res, next) {
    try {
      const attendance = await attendanceService.punchOut(req.user._id, req.body);

      res.json({
        success: true,
        message: 'Punch out successful',
        data: { attendance }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodayAttendance(req, res, next) {
    try {
      const attendance = await attendanceService.getTodayAttendance(req.user._id);

      res.json({
        success: true,
        data: { attendance }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyAttendance(req, res, next) {
    try {
      const { startDate, endDate, status, page, limit } = req.query;
      const result = await attendanceService.getMyAttendance(
        req.user._id,
        { startDate, endDate, status },
        { page, limit }
      );

      res.json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeamAttendance(req, res, next) {
    try {
      const { startDate, endDate, status, page, limit } = req.query;
      const result = await attendanceService.getTeamAttendance(
        req.user._id,
        { startDate, endDate, status },
        { page, limit }
      );

      res.json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAttendance(req, res, next) {
    try {
      const { startDate, endDate, status, userId, page, limit } = req.query;
      const result = await attendanceService.getAllAttendance(
        { startDate, endDate, status, userId },
        { page, limit }
      );

      res.json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceById(req, res, next) {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);

      res.json({
        success: true,
        data: { attendance }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const stats = await attendanceService.getMyStats(req.user._id, startDate, endDate);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDailyStats(req, res, next) {
    try {
      const { date } = req.query;
      const stats = await attendanceService.getDailyStats(date);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyStats(req, res, next) {
    try {
      const { year, month } = req.query;
      const stats = await attendanceService.getMonthlyStats(year, month);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async generateReport(req, res, next) {
    try {
      const result = await attendanceService.generateReport(req.query);

      res.json({
        success: true,
        data: result.records,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
