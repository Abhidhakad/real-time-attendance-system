import express from 'express';
import { overtimeController } from '../controllers/index.js';
import { authenticate, isManagerOrAdmin, isAdmin } from '../middlewares/index.js';
import { validate, createOvertimeSchema } from '../validations/index.js';

const router = express.Router();

router.use(authenticate);

router.post('/request', validate(createOvertimeSchema), overtimeController.createRequest);
router.get('/my', overtimeController.getMyRequests);
router.get('/my/stats', overtimeController.getMyStats);
router.get('/pending', isManagerOrAdmin, overtimeController.getPendingRequests);
router.get('/team', isManagerOrAdmin, overtimeController.getTeamRequests);
router.get('/all', isAdmin, overtimeController.getAllRequests);
router.put('/:id/approve', isManagerOrAdmin, overtimeController.approveRequest);
router.put('/:id/reject', isManagerOrAdmin, overtimeController.rejectRequest);
router.get('/:id', overtimeController.getRequestById);

export default router;
