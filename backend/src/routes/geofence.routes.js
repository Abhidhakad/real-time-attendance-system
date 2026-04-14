import express from 'express';
import { geofenceController } from '../controllers/index.js';
import { authenticate, isAdmin } from '../middlewares/index.js';
import { validate, createGeofenceSchema, updateGeofenceSchema } from '../validations/index.js';

const router = express.Router();

router.use(authenticate);

router.post('/', isAdmin, validate(createGeofenceSchema), geofenceController.create);
router.get('/', isAdmin, geofenceController.getAll);
router.get('/:id', isAdmin, geofenceController.getById);
router.put('/:id', isAdmin, validate(updateGeofenceSchema), geofenceController.update);
router.delete('/:id', isAdmin, geofenceController.remove);

export default router;
