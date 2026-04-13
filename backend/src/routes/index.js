import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import attendanceRoutes from './attendance.routes.js';
import overtimeRoutes from './overtime.routes.js';
import geofenceRoutes from './geofence.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/overtime', overtimeRoutes);
router.use('/geofence', geofenceRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
