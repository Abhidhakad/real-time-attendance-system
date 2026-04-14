import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { useGetDashboardStatsQuery } from '../features/dashboard/dashboardApi'
import { useGetMyAttendanceQuery } from '../features/attendance/attendanceApi'
import { DashboardStats, Card, LoadingSpinner } from '../components'
import { formatDate, formatTime } from '../utils'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { data, isLoading } = useGetDashboardStatsQuery()
  const { data: attendanceData } = useGetMyAttendanceQuery({ limit: 3 })
  const recentActivity = attendanceData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening with your attendance today.
        </p>
      </div>

      <DashboardStats stats={data?.data?.stats} role={user?.role} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              title="Punch In/Out"
              description="Record your attendance"
              link="/attendance"
              color="primary"
            />
            <QuickActionCard
              title="View History"
              description="Check your attendance records"
              link="/attendance/history"
              color="success"
            />
            <QuickActionCard
              title="Request OT"
              description="Submit overtime request"
              link="/overtime"
              color="warning"
            />
            <QuickActionCard
              title="My Profile"
              description="View and edit profile"
              link="/profile"
              color="info"
            />
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No recent activity found.
              </p>
            ) : (
              recentActivity.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(record.date)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {record.punchIn?.time && `Punch In: ${formatTime(record.punchIn.time)}`}
                        {record.punchIn?.time && record.punchOut?.time && ' | '}
                        {record.punchOut?.time 
                          ? `Punch Out: ${formatTime(record.punchOut.time)}` 
                          : (record.punchIn?.time ? 'Punch Out: --:--' : '')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    record.status === 'completed' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {record.status === 'completed' ? `${record.workingHours}h` : 'Incomplete'}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, link, color }) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  }

  return (
    <Link
      to={link}
      className={`block p-4 rounded-lg ${colorClasses[color]} hover:opacity-80 transition-opacity`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-80 mt-1">{description}</p>
    </Link>
  )
}

export default Dashboard
