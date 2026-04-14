import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { setCredentials, logout } from '../features/auth/authSlice'
import { useLoginMutation, useGetProfileQuery } from '../app/api/authApi'
import { clearCache } from '../app/api/apiSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, token, isAuthenticated } = useSelector((state) => state.auth)
  const [loginMutation] = useLoginMutation()
  
  const login = async (email, password) => {
    try {
      const result = await loginMutation({ email, password }).unwrap()
      dispatch(setCredentials(result.data))
      navigate('/dashboard', { replace: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.data?.message || 'Login failed' }
    }
  }

  const logoutUser = () => {
    clearCache()
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout: logoutUser,
  }
}

export const useRequireAuth = (allowedRoles = []) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, token } = useSelector((state) => state.auth)
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (token && profileData?.data?.user) {
      dispatch(setCredentials({ user: profileData.data.user, token }))
    }
  }, [token, profileData, dispatch])

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: location }, replace: true })
    } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, user, allowedRoles, navigate, location])

  return { user, isAuthenticated, loading: !user && !!token }
}
