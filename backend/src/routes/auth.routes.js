import express from 'express';
import { authController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';
import { validate, registerSchema, loginSchema, updateProfileSchema } from '../validations/index.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, authController.changePassword);

export default router;
