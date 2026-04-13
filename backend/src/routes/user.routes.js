import express from 'express';
import { userController } from '../controllers/index.js';
import { authenticate, isAdmin, isManagerOrAdmin } from '../middlewares/index.js';

const router = express.Router();

router.use(authenticate);

router.get('/', isManagerOrAdmin, userController.getAll);
router.get('/team', isManagerOrAdmin, userController.getTeamMembers);
router.get('/stats', isAdmin, userController.getStats);
router.get('/:id', isManagerOrAdmin, userController.getById);
router.put('/:id', isAdmin, userController.update);
router.delete('/:id', isAdmin, userController.deleteUser);

export default router;
