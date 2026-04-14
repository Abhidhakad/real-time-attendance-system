import { useState } from 'react'
import { Users, UserPlus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useGetUsersQuery, useAssignToManagerMutation } from '../features/user/userApi'
import { Card, Badge, Button, Input, Select, Modal, LoadingSpinner } from '../components'

const TeamAssignment = () => {
  const { user: currentUser } = useSelector((state) => state.auth)
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    page: 1,
  })
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const { data, isLoading, refetch } = useGetUsersQuery({
    role: 'employee',
    search: filters.search || undefined,
    department: filters.department || undefined,
    page: filters.page,
    limit: 50,
  })

  const [assignToManager, { isLoading: isAssigning }] = useAssignToManagerMutation()

  const users = data?.data || []
  const pagination = data?.pagination || {}

  const getDepartmentOptions = () => {
    const departments = [...new Set(users.map(u => u.department).filter(Boolean))]
    return departments.map(d => ({ value: d, label: d }))
  }

  const handleAssign = async () => {
    if (!selectedEmployee) return

    try {
      await assignToManager({
        employeeId: selectedEmployee._id,
        managerId: currentUser._id
      }).unwrap()
      
      toast.success(`${selectedEmployee.name} added to your team`)
      setShowAssignModal(false)
      refetch()
    } catch (err) {
      toast.error(err.data?.message || 'Failed to assign employee')
    }
  }

  const openAssignModal = (employee) => {
    setSelectedEmployee(employee)
    setShowAssignModal(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team members</p>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Select
            placeholder="All Departments"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            options={getDepartmentOptions()}
          />
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading employees..." />
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No employees found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.department || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.isActive ? 'success' : 'default'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.managerId === currentUser?._id ? (
                          <Badge variant="info">In Team</Badge>
                        ) : user.managerId ? (
                          <Badge variant="warning">Assigned</Badge>
                        ) : (
                          <Button size="sm" onClick={() => openAssignModal(user)}>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add to Team
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Add to Team">
        <div className="space-y-4">
          {selectedEmployee && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {selectedEmployee.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.email}</p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to add <strong>{selectedEmployee?.name}</strong> to your team?
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleAssign}
              loading={isAssigning}
              className="flex-1"
            >
              Add to Team
            </Button>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TeamAssignment