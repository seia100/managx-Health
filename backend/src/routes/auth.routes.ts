// src/routes/auth.routes.ts
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validate } from '../middlewares/validator.middleware';
import { userSchema, loginSchema } from '../validators/user.validator';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Registro de nuevos usuarios
 * @access Public
 */
router.post('/register', validate(userSchema), UserController.register);

/**
 * @route POST /api/auth/login
 * @desc Login de usuarios
 * @access Public
 */
router.post('/login', validate(loginSchema), UserController.login);

export default router;