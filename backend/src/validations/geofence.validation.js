import { z } from 'zod';

export const createGeofenceSchema = z.object({
  name: z.string().min(2).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(10).max(50000),
  isActive: z.boolean().optional()
});

export const updateGeofenceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius: z.number().min(10).max(50000).optional(),
  isActive: z.boolean().optional()
});
