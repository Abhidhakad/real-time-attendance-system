import express from 'express';
import { dashboardController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', dashboardController.getStats);

export default router;
