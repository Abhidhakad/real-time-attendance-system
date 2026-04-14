import { apiSlice } from '../../app/api/apiSlice'

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/api/v1/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/api/v1/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/api/v1/users/${id}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/v1/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getTeamMembers: builder.query({
      query: (params) => ({
        url: '/api/v1/users/team',
        params,
      }),
    }),
    getUserStats: builder.query({
      query: () => '/api/v1/users/stats',
    }),
    getManagers: builder.query({
      query: () => '/api/v1/users/managers',
      providesTags: ['User'],
    }),
    assignToManager: builder.mutation({
      query: ({ employeeId, managerId }) => ({
        url: '/api/v1/users/assign',
        method: 'POST',
        body: { employeeId, managerId },
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetTeamMembersQuery,
  useGetUserStatsQuery,
  useGetManagersQuery,
  useAssignToManagerMutation,
  useGetAllUsersQuery,
} = userApi
