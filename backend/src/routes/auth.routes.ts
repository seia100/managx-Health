// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ValidateMiddleware } from '../middleware/validate.middleware';
import { authSchemas } from '../utils/validation-schemas';

const router = Router();
const authController = new AuthController();

/**
 * Rutas de autenticación
 * No requieren autenticación previa ya que son el punto de entrada al sistema
 */
router.post(
    '/register',
    ValidateMiddleware.validateBody(authSchemas.register),
    authController.register
);

router.post(
    '/login',
    ValidateMiddleware.validateBody(authSchemas.login),
    authController.login
);

export default router;