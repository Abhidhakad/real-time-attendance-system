import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Users, Calendar, Clock } from 'lucide-react'
import { useGetTeamMembersQuery, useGetAllUsersQuery } from '../features/user/userApi'
import { useGetTeamAttendanceQuery } from '../features/attendance/attendanceApi'
import { Card, Badge, Button, Input, LoadingSpinner, Select } from '../components'
import { formatDate, formatTime } from '../utils'

const Team = () => {
  const { user } = useSelector((state) => state.auth)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    managerId: '',
  })

  const isManager = user?.role === 'manager'
  const isAdmin = user?.role === 'admin'

  const { data: allUsersData } = useGetAllUsersQuery({ role: 'manager' }, { skip: !isAdmin })
  
  const teamQuery = isAdmin 
    ? { department: filters.department || undefined, managerId: filters.managerId || undefined }
    : undefined

  const { data: teamMembers, isLoading: membersLoading, refetch: refetchMembers } = useGetTeamMembersQuery(
    isAdmin ? teamQuery : undefined,
    { skip: !isManager && !isAdmin }
  )
  
  const { data: attendanceData, isLoading: attendanceLoading } = useGetTeamAttendanceQuery({
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    limit: 100,
  })

  const isLoading = membersLoading || attendanceLoading
  const teamMembersData = teamMembers?.data?.teamMembers || []
  const team = teamMembersData
  const attendance = attendanceData?.data || []

  const getMemberAttendance = (memberId) => {
    return attendance.filter(a => a.userId?._id === memberId)
  }

  const managers = allUsersData?.data || []

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View all employees' attendance - filter by department or manager
          </p>
        </div>

        <Card>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <Select
              label="Filter by Manager"
              value={filters.managerId}
              onChange={(e) => setFilters({ ...filters, managerId: e.target.value })}
              options={[
                { value: '', label: 'All Managers' },
                ...managers.map(m => ({ value: m._id, label: m.name }))
              ]}
              className="flex-1"
            />
            <Input
              type="text"
              label="Filter by Department"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              placeholder="e.g., Engineering"
              className="flex-1"
            />
          </div>
        </Card>

        <Card>
          {membersLoading ? (
            <LoadingSpinner size="lg" text="Loading team data..." />
          ) : !teamMembersData || teamMembersData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No employees found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {teamMembersData.map((member) => {
                const memberAttendance = attendance.filter(a => a.userId?._id === member._id)
                return (
                  <div key={member._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                            {member.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>{member.department || 'No department'}</Badge>
                        {member.managerId && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Manager: {member.managerId.name}
                          </span>
                        )}
                      </div>
                    </div>
                    {memberAttendance.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Date</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Punch In</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Punch Out</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Hours</th>
                              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberAttendance.slice(0, 5).map((record) => (
                              <tr key={record._id} className="border-b border-gray-100 dark:border-gray-700/50">
                                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                                  {formatDate(record.date)}
                                </td>
                                <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
                                  {record.punchIn?.time ? formatTime(record.punchIn.time) : '--:--'}
                                </td>
                                <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
                                  {record.punchOut?.time ? formatTime(record.punchOut.time) : '--:--'}
                                </td>
                                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                                  {record.workingHours ? `${record.workingHours}h` : '0h'}
                                </td>
                                <td className="py-2 px-3">
                                  <Badge variant={record.status === 'completed' ? 'success' : 'warning'}>
                                    {record.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No attendance records found
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your team's attendance records
          </p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Input
            type="date"
            label="Start Date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="flex-1"
          />
          <Input
            type="date"
            label="End Date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="flex-1"
          />
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading team data..." />
        ) : !team || team.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No team members found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Employees must be assigned to you as manager
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {team.map((member) => {
              const memberAttendance = getMemberAttendance(member._id)
              return (
                <div key={member._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <Badge>{member.department || 'No department'}</Badge>
                  </div>

                  {memberAttendance.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Date</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Punch In</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Punch Out</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Hours</th>
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600 dark:text-gray-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberAttendance.slice(0, 5).map((record) => (
                            <tr key={record._id} className="border-b border-gray-100 dark:border-gray-700/50">
                              <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                                {formatDate(record.date)}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
                                {record.punchIn?.time ? formatTime(record.punchIn.time) : '--:--'}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-400">
                                {record.punchOut?.time ? formatTime(record.punchOut.time) : '--:--'}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                                {record.workingHours ? `${record.workingHours}h` : '0h'}
                              </td>
                              <td className="py-2 px-3">
                                <Badge variant={record.status === 'completed' ? 'success' : 'warning'}>
                                  {record.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No attendance records found
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default Team