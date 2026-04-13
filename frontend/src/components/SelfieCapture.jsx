import { useRef, useState, useEffect } from 'react'
import { Camera, RefreshCw } from 'lucide-react'
import Button from './Button'

const SelfieCapture = ({ onCapture, disabled = false }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!disabled) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [disabled])

  const startCamera = async () => {
    try {
      setLoading(true)
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Camera access denied or not available')
    } finally {
      setLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      setCapturedImage(imageData)
      onCapture(imageData)
      stopCamera()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  if (disabled) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">Camera disabled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <Camera className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && (
        <Button onClick={startCamera} variant="outline" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}

      {!error && !capturedImage && (
        <Button onClick={capturePhoto} className="w-full" disabled={loading}>
          <Camera className="w-4 h-4 mr-2" />
          Capture Photo
        </Button>
      )}

      {capturedImage && (
        <Button onClick={retakePhoto} variant="outline" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Photo
        </Button>
      )}
    </div>
  )
}

export default SelfieCapture
