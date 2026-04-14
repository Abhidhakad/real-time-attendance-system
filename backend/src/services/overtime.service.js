import { overtimeRepository, userRepository } from '../repositories/index.js';
import { formatDate } from '../utils/date.js';
import logger from '../config/logger.js';

class OvertimeService {
  async createRequest(userId, requestData) {
    const existingRequest = await overtimeRepository.existsForUserAndDate(userId, requestData.date);
    if (existingRequest) {
      const error = new Error('Overtime request already exists for this date');
      error.statusCode = 400;
      throw error;
    }

    const overtimeData = {
      userId,
      date: new Date(requestData.date),
      reason: requestData.reason,
      requestedHours: requestData.requestedHours
    };

    const overtime = await overtimeRepository.create(overtimeData);
    logger.info(`Overtime request created for user ${userId}`);

    return overtime;
  }

  async getMyRequests(userId, options) {
    return await overtimeRepository.findByUser(userId, options);
  }

  async getPendingRequests(options) {
    return await overtimeRepository.findPending(options);
  }

  async getTeamRequests(managerId, options) {
    const teamMembers = await userRepository.findByManager(managerId);
    const teamUserIds = teamMembers.map(m => m._id);

    return await overtimeRepository.findByTeam(teamUserIds, options);
  }

  async getAllRequests(query, options) {
    const queryObj = {};
    
    if (query.status) {
      queryObj.status = query.status;
    }
    if (query.userId) {
      queryObj.userId = query.userId;
    }
    if (query.startDate && query.endDate) {
      queryObj.date = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      };
    }

    return await overtimeRepository.findAll(queryObj, options);
  }

  async approveRequest(requestId, approverId, approverRole, remarks = null) {
    const request = await overtimeRepository.findById(requestId);
    if (!request) {
      const error = new Error('Overtime request not found');
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== 'pending') {
      const error = new Error('Request is not pending');
      error.statusCode = 400;
      throw error;
    }

    const requestUserId = request.userId.toString();
    const approverIdStr = approverId.toString();

    if (requestUserId === approverIdStr) {
      const error = new Error('You cannot approve your own request');
      error.statusCode = 403;
      throw error;
    }

    if (approverRole !== 'admin') {
      const { userRepository } = await import('../repositories/index.js');
      const teamMembers = await userRepository.findByManager(approverId);
      const isTeamMember = teamMembers.some(m => m._id.toString() === requestUserId);
      
      if (!isTeamMember) {
        const error = new Error('You can only approve your team members\' requests');
        error.statusCode = 403;
        throw error;
      }
    }

    const updatedRequest = await overtimeRepository.update(requestId, {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date(),
      remarks
    });

    logger.info(`Overtime request ${requestId} approved by ${approverId}`);
    return updatedRequest;
  }

  async rejectRequest(requestId, approverId, approverRole, remarks = null) {
    const request = await overtimeRepository.findById(requestId);
    if (!request) {
      const error = new Error('Overtime request not found');
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== 'pending') {
      const error = new Error('Request is not pending');
      error.statusCode = 400;
      throw error;
    }

    const requestUserId = request.userId.toString();
    const approverIdStr = approverId.toString();

    if (requestUserId === approverIdStr) {
      const error = new Error('You cannot reject your own request');
      error.statusCode = 403;
      throw error;
    }

    if (approverRole !== 'admin') {
      const { userRepository } = await import('../repositories/index.js');
      const teamMembers = await userRepository.findByManager(approverId);
      const isTeamMember = teamMembers.some(m => m._id.toString() === requestUserId);
      
      if (!isTeamMember) {
        const error = new Error('You can only reject your team members\' requests');
        error.statusCode = 403;
        throw error;
      }
    }

    const updatedRequest = await overtimeRepository.update(requestId, {
      status: 'rejected',
      approvedBy: approverId,
      approvedAt: new Date(),
      remarks
    });

    logger.info(`Overtime request ${requestId} rejected by ${approverId}`);
    return updatedRequest;
  }

  async getRequestById(id) {
    const request = await overtimeRepository.findById(id);
    if (!request) {
      const error = new Error('Overtime request not found');
      error.statusCode = 404;
      throw error;
    }
    return request;
  }

  async getStatsByUser(userId) {
    const [pending, approved, rejected] = await Promise.all([
      overtimeRepository.findByUser(userId, { limit: 100 }),
      overtimeRepository.findByUser(userId, { limit: 100 }),
      overtimeRepository.findByUser(userId, { limit: 100 })
    ]);

    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      totalHours: 0,
      approvedHours: 0
    };

    pending.requests.forEach(r => {
      if (r.status === 'pending') counts.pending++;
    });

    approved.requests.forEach(r => {
      if (r.status === 'approved') {
        counts.approved++;
        counts.approvedHours += r.requestedHours;
      }
    });

    rejected.requests.forEach(r => {
      if (r.status === 'rejected') counts.rejected++;
    });

    return counts;
  }
}

export default new OvertimeService();
