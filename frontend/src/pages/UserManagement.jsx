import { useState } from 'react'
import { Users, Edit, Trash2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useGetManagersQuery, useAssignToManagerMutation } from '../features/user/userApi'
import { Card, Badge, Button, Input, Select, Modal, LoadingSpinner } from '../components'
import { formatDate } from '../utils'

const UserManagement = () => {
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    search: '',
    page: 1,
  })
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    role: '',
    department: '',
    managerId: '',
    isActive: true,
  })

  const { data, isLoading, refetch } = useGetUsersQuery({
    role: filters.role || undefined,
    search: filters.search || undefined,
    page: filters.page,
    limit: 10,
  })

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()
  const [assignToManager, { isLoading: isAssigning }] = useAssignToManagerMutation()
  const { data: managersData } = useGetManagersQuery()

  const users = data?.data || []
  const pagination = data?.pagination || {}

  const handleEdit = (user) => {
    setSelectedUser(user)
    setEditData({
      name: user.name,
      role: user.role,
      department: user.department || '',
      managerId: user.managerId || '',
      isActive: user.isActive,
    })
    setShowEditModal(true)
  }

  const handleSave = async () => {
    try {
      if (editData.role === 'employee' && editData.managerId !== selectedUser.managerId) {
        await assignToManager({
          employeeId: selectedUser._id,
          managerId: editData.managerId || null
        }).unwrap()
        toast.success('Manager assigned successfully')
      }
      
      const userData = {
        name: editData.name,
        role: editData.role,
        department: editData.department,
        isActive: editData.isActive,
      }
      
      await updateUser({ id: selectedUser._id, ...userData }).unwrap()
      toast.success('User updated successfully')
      setShowEditModal(false)
      refetch()
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update user')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap()
        toast.success('User deleted successfully')
        refetch()
      } catch (err) {
        toast.error(err.data?.message || 'Failed to delete user')
      }
    }
  }

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
  ]

  const managerOptions = (managersData?.data || []).map(m => ({ value: m._id, label: m.name }))

  const getManagerName = (managerId) => {
    if (!managerId) return 'N/A'
    const manager = managersData?.data?.find(m => m._id === managerId)
    return manager?.name || 'N/A'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage system users</p>
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
            placeholder="All Roles"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            options={roleOptions}
          />
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading users..." />
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Manager</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Joined</th>
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
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {getManagerName(user.managerId)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.isActive ? 'success' : 'default'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit User">
        <div className="space-y-4">
          <Input
            label="Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <Select
            label="Role"
            value={editData.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            options={roleOptions}
          />
          <Input
            label="Department"
            value={editData.department}
            onChange={(e) => setEditData({ ...editData, department: e.target.value })}
          />
          <Select
            label="Manager"
            value={editData.managerId}
            onChange={(e) => setEditData({ ...editData, managerId: e.target.value })}
            options={[{ value: '', label: 'No Manager' }, ...managerOptions]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={editData.isActive}
              onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} loading={isUpdating} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement
