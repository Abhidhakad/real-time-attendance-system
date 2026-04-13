import { overtimeService } from '../services/index.js';

class OvertimeController {
  async createRequest(req, res, next) {
    try {
      const overtime = await overtimeService.createRequest(req.user._id, req.body);

      res.status(201).json({
        success: true,
        message: 'Overtime request submitted',
        data: { overtime }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyRequests(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await overtimeService.getMyRequests(req.user._id, { page, limit });

      res.json({
        success: true,
        data: result.requests,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await overtimeService.getPendingRequests({ page, limit });

      res.json({
        success: true,
        data: result.requests,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeamRequests(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const result = await overtimeService.getTeamRequests(req.user._id, { page, limit });

      let requests = result.requests;
      if (status) {
        requests = requests.filter(r => r.status === status);
      }

      res.json({
        success: true,
        data: requests,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRequests(req, res, next) {
    try {
      const { page, limit, status, userId, startDate, endDate } = req.query;
      const result = await overtimeService.getAllRequests(
        { status, userId, startDate, endDate },
        { page, limit }
      );

      res.json({
        success: true,
        data: result.requests,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async approveRequest(req, res, next) {
    try {
      const { remarks } = req.body;
      const overtime = await overtimeService.approveRequest(req.params.id, req.user._id, remarks);

      res.json({
        success: true,
        message: 'Overtime request approved',
        data: { overtime }
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const { remarks } = req.body;
      const overtime = await overtimeService.rejectRequest(req.params.id, req.user._id, remarks);

      res.json({
        success: true,
        message: 'Overtime request rejected',
        data: { overtime }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRequestById(req, res, next) {
    try {
      const overtime = await overtimeService.getRequestById(req.params.id);

      res.json({
        success: true,
        data: { overtime }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyStats(req, res, next) {
    try {
      const stats = await overtimeService.getStatsByUser(req.user._id);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OvertimeController();
