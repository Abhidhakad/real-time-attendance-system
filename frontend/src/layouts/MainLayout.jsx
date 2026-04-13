import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LayoutDashboard, 
  Clock, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react'
import { toggleTheme, toggleSidebar } from '../features/ui/uiSlice'
import { useLogoutMutation } from '../app/api/authApi'

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { theme, sidebarOpen } = useSelector((state) => state.ui)
  const [logoutMutation] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
      localStorage.removeItem('token')
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
    { path: '/attendance', label: 'Attendance', icon: Clock, roles: ['employee', 'manager', 'admin'] },
    { path: '/attendance/history', label: 'History', icon: FileText, roles: ['employee', 'manager', 'admin'] },
    { path: '/overtime', label: 'Overtime', icon: Clock, roles: ['employee', 'manager', 'admin'] },
    { path: '/team', label: 'Team', icon: Users, roles: ['manager', 'admin'] },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['admin'] },
    { path: '/admin/reports', label: 'Reports', icon: FileText, roles: ['admin'] },
    { path: '/profile', label: 'Profile', icon: Settings, roles: ['employee', 'manager', 'admin'] },
  ]

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role))

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">AMS</h1>
          ) : (
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">A</span>
          )}
          <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                {menuItems.find(item => isActive(item.path))?.label || 'Page'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
