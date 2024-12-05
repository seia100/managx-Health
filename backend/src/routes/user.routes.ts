// src/routes/user.routes.ts
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import AuthMiddleware from '../middlewares/auth.midddleware';
import { UserRole } from '../interfaces/user.interface';

const router = Router();

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    UserController.getProfile
);

router.put(
    '/:id',
    AuthMiddleware.authenticate,
    UserController.updateProfile
);

router.delete(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.ADMINISTRADOR])
    ],
    UserController.deleteUser
);

export default router;