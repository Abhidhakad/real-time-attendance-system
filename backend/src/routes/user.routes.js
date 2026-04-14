import express from 'express';
import { userController } from '../controllers/index.js';
import { authenticate, isAdmin, isManagerOrAdmin } from '../middlewares/index.js';
import { validate, assignToManagerSchema, updateUserSchema } from '../validations/index.js';

const router = express.Router();

router.use(authenticate);

router.get('/', isManagerOrAdmin, userController.getAll);
router.get('/team', isManagerOrAdmin, userController.getTeamMembers);
router.get('/stats', isAdmin, userController.getStats);
router.get('/managers', isManagerOrAdmin, userController.getManagers);
router.get('/:id', isManagerOrAdmin, userController.getById);
router.put('/:id', isAdmin, validate(updateUserSchema), userController.update);
router.delete('/:id', isAdmin, userController.deleteUser);
router.post('/assign', isManagerOrAdmin, validate(assignToManagerSchema), userController.assignToManager);

export default router;
