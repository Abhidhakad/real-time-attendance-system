import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from './features/auth/authSlice'
import { useGetProfileQuery } from './app/api/authApi'
import { AppRoutes } from './routes'

function App() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { theme } = useSelector((state) => state.ui)
  const { data, isSuccess } = useGetProfileQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    if (isSuccess && data?.data?.user) {
      dispatch(setCredentials({ user: data.data.user, token }))
    }
  }, [isSuccess, data, dispatch, token])

  return <AppRoutes />
}

export default App
