import { apiSlice } from '../../app/api/apiSlice'

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    punchIn: builder.mutation({
      query: (data) => ({
        url: '/api/v1/attendance/punch-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    punchOut: builder.mutation({
      query: (data) => ({
        url: '/api/v1/attendance/punch-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query({
      query: () => '/api/v1/attendance/today',
      providesTags: ['Attendance'],
    }),
    getMyAttendance: builder.query({
      query: (params) => ({
        url: '/api/v1/attendance/my',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    getTeamAttendance: builder.query({
      query: (params) => ({
        url: '/api/v1/attendance/team',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query({
      query: (params) => ({
        url: '/api/v1/attendance/all',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    getAttendanceReport: builder.query({
      query: (params) => ({
        url: '/api/v1/attendance/report',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    getMyStats: builder.query({
      query: (params) => ({
        url: '/api/v1/attendance/my/stats',
        params,
      }),
    }),
  }),
})

export const {
  usePunchInMutation,
  usePunchOutMutation,
  useGetTodayAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetTeamAttendanceQuery,
  useGetAllAttendanceQuery,
  useGetAttendanceReportQuery,
  useGetMyStatsQuery,
} = attendanceApi
