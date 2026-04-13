import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Calendar, Download, Filter } from 'lucide-react'
import { useGetMyAttendanceQuery, useGetTeamAttendanceQuery, useGetAllAttendanceQuery } from '../features/attendance/attendanceApi'
import { Card, Badge, Button, Input, Select, ExportButton, LoadingSpinner } from '../components'
import { formatDate, formatTime, getTodayDateString } from '../utils'

const AttendanceHistory = () => {
  const { user } = useSelector((state) => state.auth)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    page: 1,
  })

  const queryParams = {
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    status: filters.status || undefined,
    page: filters.page,
    limit: 10,
  }

  const { data: myData, isLoading: myLoading } = useGetMyAttendanceQuery(queryParams, {
    skip: user?.role === 'manager' || user?.role === 'admin',
  })

  const { data: teamData, isLoading: teamLoading } = useGetTeamAttendanceQuery(queryParams, {
    skip: user?.role !== 'manager' && user?.role !== 'admin',
  })

  const { data: allData, isLoading: allLoading } = useGetAllAttendanceQuery(queryParams, {
    skip: user?.role !== 'admin',
  })

  const isLoading = myLoading || teamLoading || allLoading
  const data = user?.role === 'admin' ? allData : (user?.role === 'manager' ? teamData : myData)
  const records = data?.data || []
  const pagination = data?.pagination || {}

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 })
  }

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Attendance History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage attendance records
          </p>
        </div>
        <ExportButton data={records} title="Attendance_Report" />
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="flex-1"
          />
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="flex-1"
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { value: 'completed', label: 'Completed' },
              { value: 'incomplete', label: 'Incomplete' },
            ]}
            className="flex-1"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading attendance..." />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No attendance records found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                    {user?.role !== 'employee' && (
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                    )}
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Punch In</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Punch Out</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {formatDate(record.date)}
                      </td>
                      {user?.role !== 'employee' && (
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {record.userId?.name || 'N/A'}
                        </td>
                      )}
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {record.punchIn?.time ? formatTime(record.punchIn.time) : '--:--'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {record.punchOut?.time ? formatTime(record.punchOut.time) : '--:--'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {record.workingHours ? `${record.workingHours}h` : '0h'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={record.status === 'completed' ? 'success' : 'warning'}>
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default AttendanceHistory
