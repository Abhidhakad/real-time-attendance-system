import { apiSlice } from '../../app/api/apiSlice'

export const overtimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOvertimeRequest: builder.mutation({
      query: (data) => ({
        url: '/api/v1/overtime/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Overtime'],
    }),
    getMyOvertimeRequests: builder.query({
      query: (params) => ({
        url: '/api/v1/overtime/my',
        params,
      }),
      providesTags: ['Overtime'],
    }),
    getPendingOvertimeRequests: builder.query({
      query: (params) => ({
        url: '/api/v1/overtime/pending',
        params,
      }),
      providesTags: ['Overtime'],
    }),
    getTeamOvertimeRequests: builder.query({
      query: (params) => ({
        url: '/api/v1/overtime/team',
        params,
      }),
      providesTags: ['Overtime'],
    }),
    getAllOvertimeRequests: builder.query({
      query: (params) => ({
        url: '/api/v1/overtime/all',
        params,
      }),
      providesTags: ['Overtime'],
    }),
    approveOvertime: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `/api/v1/overtime/${id}/approve`,
        method: 'PUT',
        body: { remarks },
      }),
      invalidatesTags: ['Overtime'],
    }),
    rejectOvertime: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `/api/v1/overtime/${id}/reject`,
        method: 'PUT',
        body: { remarks },
      }),
      invalidatesTags: ['Overtime'],
    }),
    getMyOvertimeStats: builder.query({
      query: () => '/api/v1/overtime/my/stats',
    }),
  }),
})

export const {
  useCreateOvertimeRequestMutation,
  useGetMyOvertimeRequestsQuery,
  useGetPendingOvertimeRequestsQuery,
  useGetTeamOvertimeRequestsQuery,
  useGetAllOvertimeRequestsQuery,
  useApproveOvertimeMutation,
  useRejectOvertimeMutation,
  useGetMyOvertimeStatsQuery,
} = overtimeApi
