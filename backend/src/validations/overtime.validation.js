import { z } from 'zod';

export const createOvertimeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  requestedHours: z.coerce.number().min(0.5, 'Minimum 0.5 hours').max(12, 'Maximum 12 hours')
});

export const updateOvertimeSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  remarks: z.string().max(500).optional()
});
