import { useState } from 'react'
import { MapPin, Edit, Trash2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useGetGeofencesQuery, useCreateGeofenceMutation, useUpdateGeofenceMutation, useDeleteGeofenceMutation } from '../features/geofence/geofenceApi'
import { Card, Badge, Button, Input, Modal, LoadingSpinner } from '../components'
import { formatDate } from '../utils'

const GeofenceManagement = () => {
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
  })
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedGeofence, setSelectedGeofence] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: '',
    isActive: true,
  })

  const { data, isLoading, refetch } = useGetGeofencesQuery({
    search: filters.search || undefined,
    page: filters.page,
    limit: 10,
  })

  const [createGeofence, { isLoading: isCreating }] = useCreateGeofenceMutation()
  const [updateGeofence, { isLoading: isUpdating }] = useUpdateGeofenceMutation()
  const [deleteGeofence] = useDeleteGeofenceMutation()

  const geofences = data?.data || []
  const pagination = data?.pagination || {}

  const handleOpenModal = (geofence = null) => {
    if (geofence) {
      setEditMode(true)
      setSelectedGeofence(geofence)
      const [longitude, latitude] = geofence.center.coordinates
      setFormData({
        name: geofence.name,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: geofence.radius.toString(),
        isActive: geofence.isActive,
      })
    } else {
      setEditMode(false)
      setSelectedGeofence(null)
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        radius: '',
        isActive: true,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }

    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)
    const rad = parseInt(formData.radius)

    if (isNaN(lat) || lat < -90 || lat > 90) {
      toast.error('Latitude must be between -90 and 90')
      return
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      toast.error('Longitude must be between -180 and 180')
      return
    }
    if (isNaN(rad) || rad < 10 || rad > 50000) {
      toast.error('Radius must be between 10 and 50000 meters')
      return
    }

    const payload = {
      name: formData.name.trim(),
      latitude: lat,
      longitude: lng,
      radius: rad,
      isActive: formData.isActive,
    }

    try {
      if (editMode) {
        await updateGeofence({ id: selectedGeofence._id, ...payload }).unwrap()
        toast.success('Geofence updated successfully')
      } else {
        await createGeofence(payload).unwrap()
        toast.success('Geofence created successfully')
      }
      setShowModal(false)
      refetch()
    } catch (err) {
      toast.error(err.data?.message || `Failed to ${editMode ? 'update' : 'create'} geofence`)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this geofence?')) {
      try {
        await deleteGeofence(id).unwrap()
        toast.success('Geofence deleted successfully')
        refetch()
      } catch (err) {
        toast.error(err.data?.message || 'Failed to delete geofence')
      }
    }
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          })
        },
        (error) => {
          toast.error('Unable to get current location')
        }
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Geofence Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage attendance zones</p>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Geofence
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading geofences..." />
        ) : geofences.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No geofences found</p>
            <Button variant="outline" className="mt-4" onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Geofence
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Radius</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {geofences.map((geofence) => {
                    const [, latitude] = geofence.center.coordinates
                    const [longitude] = geofence.center.coordinates
                    return (
                      <tr key={geofence._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">{geofence.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {latitude.toFixed(6)}, {longitude.toFixed(6)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {geofence.radius.toLocaleString()}m
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={geofence.isActive ? 'success' : 'default'}>
                            {geofence.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(geofence.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleOpenModal(geofence)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(geofence._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMode ? 'Edit Geofence' : 'Add Geofence'}>
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Office Building"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            minLength={2}
            maxLength={100}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                min={-90}
                max={90}
                required
              />
              <Input
                placeholder="Longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                min={-180}
                max={180}
                required
              />
            </div>
            <Button variant="outline" size="sm" className="mt-2" onClick={handleGetCurrentLocation}>
              Use Current Location
            </Button>
          </div>
          <Input
            label="Radius (meters)"
            placeholder="100"
            type="number"
            value={formData.radius}
            onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
            min={10}
            max={50000}
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              loading={isCreating || isUpdating}
              className="flex-1"
            >
              {editMode ? 'Save Changes' : 'Create Geofence'}
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GeofenceManagement