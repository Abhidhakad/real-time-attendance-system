import { useState } from 'react'
import { FileText, Download, Calendar } from 'lucide-react'
import { useGetAttendanceReportQuery } from '../features/attendance/attendanceApi'
import { useGetUsersQuery } from '../features/user/userApi'
import { Card, Input, Select, ExportButton, LoadingSpinner } from '../components'
import { formatDate, formatTime } from '../utils'

const Reports = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    page: 1,
    limit: 100,
  })

  const { data: usersData } = useGetUsersQuery({ limit: 100 })
  const { data: reportData, isLoading } = useGetAttendanceReportQuery({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    userId: filters.userId || undefined,
    page: filters.page,
    limit: filters.limit,
  })

  const users = usersData?.data || []
  const report = reportData?.data || []
  const pagination = reportData?.pagination || {}

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const userOptions = users.map(user => ({
    value: user._id,
    label: user.name,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and export attendance reports</p>
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
            label="Employee"
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
            options={userOptions}
            placeholder="All Employees"
            className="flex-1"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Report Data ({pagination.total || 0} records)
          </h3>
          <ExportButton data={report} title="Attendance_Report" />
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Generating report..." />
        ) : report.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No data available for the selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Punch In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Punch Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.map((record) => (
                  <tr key={record._id} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {record.userId?.selfie && (
                          <img
                            src={record.punchIn?.selfie}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {record.userId?.name || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {record.userId?.department || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {record.punchIn?.selfie && (
                          <img
                            src={record.punchIn.selfie}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {record.punchIn?.time ? formatTime(record.punchIn.time) : '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {record.punchOut?.selfie && (
                          <img
                            src={record.punchOut.selfie}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {record.punchOut?.time ? formatTime(record.punchOut.time) : '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {record.workingHours ? `${record.workingHours}h` : '0h'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        record.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Reports
