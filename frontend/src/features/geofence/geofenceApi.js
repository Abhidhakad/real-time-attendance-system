import { apiSlice } from '../../app/api/apiSlice'

export const geofenceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeofences: builder.query({
      query: (params) => ({
        url: '/api/v1/geofence',
        params,
      }),
      providesTags: ['Geofence'],
    }),
    getGeofence: builder.query({
      query: (id) => `/api/v1/geofence/${id}`,
      providesTags: ['Geofence'],
    }),
    createGeofence: builder.mutation({
      query: (data) => ({
        url: '/api/v1/geofence',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Geofence'],
    }),
    updateGeofence: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/geofence/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Geofence'],
    }),
    deleteGeofence: builder.mutation({
      query: (id) => ({
        url: `/api/v1/geofence/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Geofence'],
    }),
  }),
})

export const {
  useGetGeofencesQuery,
  useGetGeofenceQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useDeleteGeofenceMutation,
} = geofenceApi