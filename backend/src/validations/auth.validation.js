import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['employee', 'manager', 'admin']).optional(),
  department: z.string().optional(),
  managerId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  department: z.string().optional(),
  avatar: z.string().url().optional().nullable()
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['employee', 'manager', 'admin']).optional(),
  department: z.string().optional(),
  managerId: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});

export const assignToManagerSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  managerId: z.string().min(1, 'Manager ID is required').nullable()
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
    
    const issues = err?.issues || [];

    if (issues.length > 0) {
      return res.status(400).json({
        success: false,
        message: issues[0].message, 
        field: issues[0].path?.[0] || null
      });
    }

    console.error('Validation error:', err);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong'
    });
  }
};
