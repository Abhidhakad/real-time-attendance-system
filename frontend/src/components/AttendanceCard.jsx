import { useState, useEffect } from 'react'
import { MapPin, Clock, Camera } from 'lucide-react'
import Badge from './Badge'
import Card from './Card'
import { formatTime } from '../utils'

const AttendanceCard = ({ attendance, isPunchedIn, loading }) => {
  const [elapsedTime, setElapsedTime] = useState(null)

  useEffect(() => {
    if (attendance?.punchIn?.time && !attendance?.punchOut?.time) {
      const updateTimer = () => {
        const punchInTime = new Date(attendance.punchIn.time).getTime()
        const now = Date.now()
        const diff = now - punchInTime
        setElapsedTime(diff)
      }
      
      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    } else {
      setElapsedTime(null)
    }
  }, [attendance?.punchIn?.time, attendance?.punchOut?.time])

  const formatElapsedTime = (ms) => {
    if (!ms) return '0h 0m 0s'
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor(ms / (1000 * 60 * 60))
    return `${hours}h ${minutes}m ${seconds}s`
  }

  return (
    <Card className="w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Attendance
            </h3>
            <Badge variant={isPunchedIn ? (attendance?.punchOut ? 'success' : 'warning') : 'default'}>
              {isPunchedIn 
                ? (attendance?.punchOut ? 'Completed' : 'In Progress')
                : 'Not Punched In'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Punch In</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {attendance?.punchIn?.time ? formatTime(attendance.punchIn.time) : '--:--'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Punch Out</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {attendance?.punchOut?.time ? formatTime(attendance.punchOut.time) : '--:--'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Working Hours</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {elapsedTime !== null 
                    ? formatElapsedTime(elapsedTime)
                    : (attendance?.workingHours ? `${attendance.workingHours}h` : '0h')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {attendance?.status || 'incomplete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {attendance?.punchIn?.selfie && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Punch In Photo</p>
            <img
              src={attendance.punchIn.selfie}
              alt="Punch In"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        {attendance?.punchOut?.selfie && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Punch Out Photo</p>
            <img
              src={attendance.punchOut.selfie}
              alt="Punch Out"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default AttendanceCard
