import { userService } from './index.js';
import { attendanceRepository, overtimeRepository } from '../repositories/index.js';
import { getTodayDateString } from '../utils/date.js';


export const getEmployeeStats = async (userId) => {
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

  
  for (const s of attendanceStats) {
    stats.totalAttendance += s.count;

    if (s._id === 'completed') {
      stats.completedDays = s.count;
      stats.totalHours = s.totalHours || 0;
    } else if (s._id === 'incomplete') {
      stats.incompleteDays = s.count;
    }
  }

 
  for (const r of otStats.requests || []) {
    if (r.status === 'pending') stats.pendingOT++;

    if (r.status === 'approved') {
      stats.approvedOT++;
      stats.totalOTHours += r.requestedHours || 0;
    }

    if (r.status === 'rejected') stats.rejectedOT++;
  }

  return stats;
};


export const getManagerStats = async (managerId) => {
  const teamMembers = await userService.getTeamMembers(managerId);
  const teamUserIds = teamMembers.map((m) => m._id);
  
  if (teamUserIds.length === 0) {
    return {
      teamSize: 0,
      todayPresent: 0,
      todayAbsent: 0,
      pendingOTRequests: 0,
      teamMonthlyStats: []
    };
  }

  const today = getTodayDateString();

  const [todayStats, monthStats] = await Promise.all([
    attendanceRepository.getDailyStatsByTeam(teamUserIds, today),
    attendanceRepository.getMonthlyStatsByTeam(
      teamUserIds,
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

  todayStats.forEach((s) => {
    if (s._id === 'completed' || s._id === 'incomplete') {
      stats.todayPresent += s.count;
      stats.todayAbsent = teamMembers.length - stats.todayPresent;
    }
  });

  return stats;
};


export const getAdminStats = async () => {
  const [userStats, todayStats] = await Promise.all([
    userService.getStats(),
    attendanceRepository.getDailyStats(getTodayDateString())
  ]);

  const stats = {
    ...userStats,
    todayPresent: 0,
    todayIncomplete: 0
  };

  todayStats.forEach((s) => {
    if (s._id === 'completed') {
      stats.todayPresent = s.count;
    } else if (s._id === 'incomplete') {
      stats.todayIncomplete = s.count;
    }
  });

  return stats;
};


export const getStats = async (userId, role) => {
  switch (role) {
    case 'admin':
      return getAdminStats();

    case 'manager':
      return getManagerStats(userId);

    default:
      return getEmployeeStats(userId);
  }
};