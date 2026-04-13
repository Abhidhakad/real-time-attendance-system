import express from 'express';
import { attendanceController } from '../controllers/index.js';
import { authenticate, isManagerOrAdmin, isAdmin } from '../middlewares/index.js';
import { validate, punchInSchema, punchOutSchema } from '../validations/index.js';

const router = express.Router();

router.use(authenticate);

router.post('/punch-in', validate(punchInSchema), attendanceController.punchIn);
router.post('/punch-out', validate(punchOutSchema), attendanceController.punchOut);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/my', attendanceController.getMyAttendance);
router.get('/my/stats', attendanceController.getMyStats);
router.get('/team', isManagerOrAdmin, attendanceController.getTeamAttendance);
router.get('/all', isAdmin, attendanceController.getAllAttendance);
router.get('/stats/daily', isAdmin, attendanceController.getDailyStats);
router.get('/stats/monthly', isAdmin, attendanceController.getMonthlyStats);
router.get('/report', isManagerOrAdmin, attendanceController.generateReport);
router.get('/:id', attendanceController.getAttendanceById);

export default router;
