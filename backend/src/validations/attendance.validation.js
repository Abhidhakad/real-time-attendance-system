import { z } from 'zod';

export const punchInSchema = z.object({
  selfie: z.string().min(1, 'Selfie is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional()
});

export const punchOutSchema = z.object({
  selfie: z.string().min(1, 'Selfie is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional()
});

export const attendanceQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['completed', 'incomplete']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional()
});
