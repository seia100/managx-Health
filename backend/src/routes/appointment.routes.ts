// src/routes/appointment.routes.ts
import { Router } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import AuthMiddleware from '../middlewares/auth.midddleware';
import { UserRole } from '../interfaces/user.interface';

const router = Router();

router.post(
    '/',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO, UserRole.ENFERMERO])
    ],
    AppointmentController.createAppointment
);

router.get(
    '/',
    AuthMiddleware.authenticate,
    AppointmentController.getAppointments
);

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    AppointmentController.getAppointmentById
);

router.put(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO, UserRole.ENFERMERO])
    ],
    AppointmentController.updateAppointment
);

router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    AppointmentController.cancelAppointment
);

export default router;