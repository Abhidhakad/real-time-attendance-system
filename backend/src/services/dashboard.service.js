import { userService } from './index.js';
import { attendanceRepository } from '../repositories/index.js';
import { overtimeRepository } from '../repositories/index.js';
import { getTodayDateString } from '../utils/date.js';

class DashboardService {
  async getEmployeeStats(userId) {
    const [attendanceStats, otStats] = await Promise.all([
      attendanceRepository.getStatsByUser(userId),
      overtimeRepository.findByUser(userId, { limit: 100 })
    ]);

    const stats = {
      totalAttendance: 0,
      completedDays: 0,
      incompleteDays: 0,
      totalHours: 0,
      pendingOT: 0,
      approvedOT: 0,
      rejectedOT: 0,
      totalOTHours: 0
    };

    attendanceStats.forEach(s => {
      stats.totalAttendance += s.count;
      if (s._id === 'completed') {
        stats.completedDays = s.count;
        stats.totalHours = s.totalHours;
      } else if (s._id === 'incomplete') {
        stats.incompleteDays = s.count;
      }
    });

    otStats.requests.forEach(r => {
      if (r.status === 'pending') stats.pendingOT++;
      if (r.status === 'approved') {
        stats.approvedOT++;
        stats.totalOTHours += r.requestedHours;
      }
      if (r.status === 'rejected') stats.rejectedOT++;
    });

    return stats;
  }

  async getManagerStats(managerId) {
    const teamMembers = await userService.getTeamMembers(managerId);
    const teamUserIds = teamMembers.map(m => m._id);

    const today = getTodayDateString();
    const [todayStats, monthStats] = await Promise.all([
      attendanceRepository.getDailyStats(today),
      attendanceRepository.getMonthlyStats(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      )
    ]);

    const stats = {
      teamSize: teamMembers.length,
      todayPresent: 0,
      todayAbsent: teamMembers.length,
      pendingOTRequests: 0,
      teamMonthlyStats: monthStats
    };

    todayStats.forEach(s => {
      if (s._id === 'completed' || s._id === 'incomplete') {
        stats.todayPresent += s.count;
        stats.todayAbsent = teamMembers.length - stats.todayPresent;
      }
    });

    return stats;
  }

  async getAdminStats() {
    const [userStats, todayStats] = await Promise.all([
      userService.getStats(),
      attendanceRepository.getDailyStats(getTodayDateString())
    ]);

    const stats = {
      ...userStats,
      todayPresent: 0,
      todayIncomplete: 0
    };

    todayStats.forEach(s => {
      if (s._id === 'completed') {
        stats.todayPresent = s.count;
      } else if (s._id === 'incomplete') {
        stats.todayIncomplete = s.count;
      }
    });

    return stats;
  }

  async getStats(userId, role) {
    switch (role) {
      case 'admin':
        return await this.getAdminStats();
      case 'manager':
        return await this.getManagerStats(userId);
      default:
        return await this.getEmployeeStats(userId);
    }
  }
}

export default new DashboardService();
