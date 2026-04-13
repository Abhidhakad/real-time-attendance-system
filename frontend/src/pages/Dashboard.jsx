import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useGetDashboardStatsQuery } from '../features/dashboard/dashboardApi'
import { DashboardStats, Card, LoadingSpinner } from '../components'

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const { data, isLoading, error } = useGetDashboardStatsQuery()

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
          Welcome back, {user?.name}!
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
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your recent attendance activity will appear here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

const QuickActionCard = ({ title, description, link, color, to }) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  }

  return (
    <a
      href={link}
      className={`block p-4 rounded-lg ${colorClasses[color]} hover:opacity-80 transition-opacity`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-80 mt-1">{description}</p>
    </a>
  )
}

export default Dashboard
