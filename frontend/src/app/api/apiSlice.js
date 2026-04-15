import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { store } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Attendance', 'Overtime', 'Dashboard', 'Geofence'],
  endpoints: () => ({}),
})

export const clearCache = () => {
  store.dispatch(apiSlice.util.resetApiState())
}

export const forceRefetch = () => {
  store.dispatch(apiSlice.util.invalidateTags(['Attendance', 'User', 'Overtime', 'Dashboard', 'Geofence']))
}
