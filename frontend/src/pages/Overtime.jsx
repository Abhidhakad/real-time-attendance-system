import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Clock, Plus, Check, X, Calendar, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { 
  useGetMyOvertimeRequestsQuery, 
  useGetAllOvertimeRequestsQuery,
  useGetTeamOvertimeRequestsQuery,
  useCreateOvertimeRequestMutation, 
  useApproveOvertimeMutation, 
  useRejectOvertimeMutation 
} from '../features/overtime/overtimeApi'
import { Card, Badge, Button, Input, Modal, LoadingSpinner } from '../components'
import { formatDate, getTodayDateString } from '../utils'

const Overtime = () => {
  const { user } = useSelector((state) => state.auth)
  const [showRequestModal, setShowRequestModal] = useState(false)
  
  const { data: myRequests, isLoading: myLoading, refetch: refetchMy } = useGetMyOvertimeRequestsQuery({ limit: 50 })
  
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  
  const { data: allPending, isLoading: allLoading, refetch: refetchAll } = useGetAllOvertimeRequestsQuery(
    { status: 'pending', limit: 100 },
    { skip: !isAdmin }
  )
  
  const { data: teamPending, isLoading: teamLoading, refetch: refetchTeam } = useGetTeamOvertimeRequestsQuery(
    { status: 'pending', limit: 100 },
    { skip: !isManager }
  )

  const teamPendingRequests = teamPending?.data || []
  
  const [createRequest, { isLoading: isCreating }] = useCreateOvertimeRequestMutation()
  const [approveRequest] = useApproveOvertimeMutation()
  const [rejectRequest] = useRejectOvertimeMutation()

  const [formData, setFormData] = useState({
    date: '',
    reason: '',
    requestedHours: '',
  })

  const pendingLoading = isAdmin ? allLoading : isManager ? teamLoading : false
  const pendingData = isAdmin ? allPending?.data : []

  useEffect(() => {
    if (isAdmin) refetchAll()
    else if (isManager) refetchTeam()
  }, [isAdmin, isManager])

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    try {
      await createRequest({
        date: formData.date,
        reason: formData.reason,
        requestedHours: parseFloat(formData.requestedHours),
      }).unwrap()
      toast.success('Overtime request submitted!')
      setShowRequestModal(false)
      setFormData({ date: '', reason: '', requestedHours: '' })
      refetchMy()
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create request')
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveRequest({ id }).unwrap()
      toast.success('Request approved')
      if (isAdmin) refetchAll()
      else if (isManager) refetchTeam()
      refetchMy()
    } catch (err) {
      toast.error(err.data?.message || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectRequest({ id }).unwrap()
      toast.success('Request rejected')
      if (isAdmin) refetchAll()
      else if (isManager) refetchTeam()
      refetchMy()
    } catch (err) {
      toast.error(err.data?.message || 'Failed to reject')
    }
  }

  const requests = myRequests?.data || []
  const canManage = isAdmin || isManager

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overtime</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage overtime requests</p>
        </div>
        <Button onClick={() => setShowRequestModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Request OT
        </Button>
      </div>

      {canManage && (
        <Card title={isAdmin ? 'All Pending Requests' : 'Team Pending Requests'}>
          {pendingLoading ? (
            <LoadingSpinner size="lg" text="Loading requests..." />
          ) : (() => {
            const displayRequests = isAdmin ? pendingData : teamPendingRequests
            if (!displayRequests || displayRequests.length === 0) return (
              <div className="text-center py-8">
                <Users className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'No pending requests' : 'No pending requests from your team'}
                </p>
              </div>
            )
            return (
              <div className="space-y-4">
                {displayRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {request.userId?.name || 'Unknown'}
                        </span>
                        {request.userId?.role && (
                          <Badge variant={request.userId.role === 'manager' ? 'warning' : 'info'}>
                            {request.userId.role}
                          </Badge>
                        )}
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(request.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.requestedHours}h
                        </span>
                      </div>
                    </div>
                    {request.userId?._id !== user?._id && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleApprove(request._id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleReject(request._id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}
        </Card>
      )}

      <Card title="My Overtime Requests">
        {myLoading ? (
          <LoadingSpinner size="lg" text="Loading requests..." />
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No overtime requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{request.reason}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(request.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {request.requestedHours}h
                    </span>
                  </div>
                </div>
                <Badge variant={
                  request.status === 'approved' ? 'success' : 
                  request.status === 'rejected' ? 'danger' : 'warning'
                }>
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Overtime">
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={getTodayDateString()}
            required
          />
          <Input
            type="number"
            label="Requested Hours"
            value={formData.requestedHours}
            onChange={(e) => setFormData({ ...formData, requestedHours: e.target.value })}
            min="0.5"
            max="12"
            step="0.5"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
              rows="3"
              required
              minLength="10"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" loading={isCreating}>
              Submit Request
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Overtime