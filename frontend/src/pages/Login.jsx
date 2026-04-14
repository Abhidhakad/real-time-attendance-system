import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { setCredentials } from '../features/auth/authSlice'
import { useLoginMutation } from '../app/api/authApi'
import { clearCache } from '../app/api/apiSlice'
import { Button, Input, Card } from '../components'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginMutation, { isLoading }] = useLoginMutation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearCache()
    try {
      const result = await loginMutation(formData).unwrap()
      dispatch(setCredentials(result.data))
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.data?.message || 'Login failed')
    }
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="yourmail@gmail.com"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default Login
