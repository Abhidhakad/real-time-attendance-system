import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Card from './Card'

const StatsCard = ({ title, value, icon: Icon, trend, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
  }

  return (
    <Card className={variantClasses[variant]}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${variantClasses[variant]}`}>
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
      </div>
    </Card>
  )
}

export const DashboardStats = ({ stats, role }) => {
  if (!stats) return null

  if (role === 'employee') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Attendance"
          value={stats.totalAttendance || 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Completed Days"
          value={stats.completedDays || 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Total Hours"
          value={`${stats.totalHours || 0}h`}
          icon={Clock}
          variant="primary"
        />
        <StatsCard
          title="Pending OT Requests"
          value={stats.pendingOT || 0}
          icon={AlertCircle}
          variant="warning"
        />
      </div>
    )
  }

  if (role === 'manager') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Team Size"
          value={stats.teamSize || 0}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Present Today"
          value={stats.todayPresent || 0}
          icon={CheckCircle}
          variant="success"
        />
        <StatsCard
          title="Pending OT"
          value={stats.pendingOTRequests || 0}
          icon={AlertCircle}
          variant="warning"
        />
        <StatsCard
          title="Absent Today"
          value={stats.todayAbsent || 0}
          icon={Users}
        />
      </div>
    )
  }

  if (role === 'admin') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Users" value={stats.total || 0} icon={Users} variant="primary" />
        <StatsCard title="Employees" value={stats.employees || 0} icon={Users} />
        <StatsCard title="Managers" value={stats.managers || 0} icon={Users} />
        <StatsCard title="Present Today" value={stats.todayPresent || 0} icon={CheckCircle} variant="success" />
        <StatsCard title="Incomplete" value={stats.todayIncomplete || 0} icon={AlertCircle} variant="warning" />
      </div>
    )
  }

  return null
}

export default StatsCard
