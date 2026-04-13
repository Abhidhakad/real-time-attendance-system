import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
  const { token } = useSelector((state) => state.auth)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">AMS</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Attendance Management System</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
