import { useState } from 'react'
import { useSelector } from 'react-redux'
import { MapPin, Camera, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePunchInMutation, usePunchOutMutation, useGetTodayAttendanceQuery } from '../features/attendance/attendanceApi'
import { AttendanceCard, SelfieCapture, Button, Card, Modal } from '../components'
import { getLocation } from '../utils'

const Attendance = () => {
  const { user } = useSelector((state) => state.auth)
  const { data: todayData, refetch } = useGetTodayAttendanceQuery()
  const [punchInMutation, { isLoading: isPunchingIn }] = usePunchInMutation()
  const [punchOutMutation, { isLoading: isPunchingOut }] = usePunchOutMutation()
  
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [location, setLocation] = useState(null)
  const [actionType, setActionType] = useState(null)

  const attendance = todayData?.data?.attendance
  const isPunchedIn = !!attendance?.punchIn?.time
  const isPunchedOut = !!attendance?.punchOut?.time

  const handleGetLocation = async () => {
    try {
      const loc = await getLocation()
      setLocation(loc)
    } catch (err) {
      toast.error('Could not get location. Please enable location services.')
    }
  }

  const handleCapture = (image) => {
    setCapturedImage(image)
  }

  const handlePunchIn = async () => {
    if (!capturedImage) {
      toast.error('Please capture your selfie first')
      return
    }
    if (!location) {
      toast.error('Please enable location services')
      return
    }

    try {
      await punchInMutation({
        selfie: capturedImage,
        latitude: location.latitude,
        longitude: location.longitude,
      }).unwrap()
      toast.success('Punch in successful!')
      refetch()
      setShowCamera(false)
      setCapturedImage(null)
      setLocation(null)
    } catch (err) {
      toast.error(err.data?.message || 'Punch in failed')
    }
  }

  const handlePunchOut = async () => {
    if (!capturedImage) {
      toast.error('Please capture your selfie first')
      return
    }
    if (!location) {
      toast.error('Please enable location services')
      return
    }

    try {
      await punchOutMutation({
        selfie: capturedImage,
        latitude: location.latitude,
        longitude: location.longitude,
      }).unwrap()
      toast.success('Punch out successful!')
      refetch()
      setShowCamera(false)
      setCapturedImage(null)
      setLocation(null)
    } catch (err) {
      toast.error(err.data?.message || 'Punch out failed')
    }
  }

  const openCamera = (type) => {
    setActionType(type)
    setShowCamera(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <AttendanceCard 
        attendance={attendance} 
        isPunchedIn={isPunchedIn}
      />

      {!isPunchedOut && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isPunchedIn ? (
            <Card title="Punch In">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Capture your selfie and enable location to punch in.
              </p>
              <Button onClick={() => openCamera('in')} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Punch In
              </Button>
            </Card>
          ) : (
            <Card title="Punch Out">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Don't forget to punch out when you leave!
              </p>
              <Button onClick={() => openCamera('out')} className="w-full" variant="danger">
                <Camera className="w-4 h-4 mr-2" />
                Start Punch Out
              </Button>
            </Card>
          )}
        </div>
      )}

      <Modal 
        isOpen={showCamera} 
        onClose={() => {
          setShowCamera(false)
          setCapturedImage(null)
          setLocation(null)
        }} 
        title={actionType === 'in' ? 'Punch In' : 'Punch Out'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleGetLocation}
              variant="outline"
              className="flex-1"
              disabled={!!location}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {location ? 'Location Captured' : 'Get Location'}
            </Button>
          </div>

          {location && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
              Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
          )}

          <SelfieCapture 
            onCapture={handleCapture} 
            disabled={!location}
          />

          <div className="flex gap-2">
            <Button
              onClick={actionType === 'in' ? handlePunchIn : handlePunchOut}
              className="flex-1"
              loading={isPunchingIn || isPunchingOut}
              disabled={!capturedImage || !location}
            >
              {actionType === 'in' ? 'Confirm Punch In' : 'Confirm Punch Out'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Attendance
