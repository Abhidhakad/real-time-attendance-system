import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MainLayout, AuthLayout } from '../layouts'
import {
  Login,
  Register,
  Dashboard,
  Attendance,
  AttendanceHistory,
  Overtime,
  Profile,
  Team,
  TeamAssignment,
  UserManagement,
  Reports,
  GeofenceManagement,
} from '../pages'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/history" element={<AttendanceHistory />} />
        <Route path="/overtime" element={<Overtime />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route
          path="/team"
          element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <Team />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/team/assign"
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <TeamAssignment />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/geofence"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GeofenceManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
