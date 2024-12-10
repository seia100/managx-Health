// src/routes/appointment.routes.ts
import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { RBACMiddleware } from '../middleware/rbac.middleware';
import { ValidateMiddleware } from '../middleware/validate.middleware';
import { appointmentSchemas } from '../utils/validation-schemas';
import { APP_CONSTANTS } from '../config/constants';

const router = Router();
const appointmentController = new AppointmentController();

/**
 * Rutas de citas médicas
 * Implementan validación de fechas y disponibilidad
 * Manejan diferentes estados de citas
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    ValidateMiddleware.validateBody(appointmentSchemas.createAppointment),
    appointmentController.create
);

router.get(
    '/',
    AuthMiddleware.authenticate,
    ValidateMiddleware.validateQuery(appointmentSchemas.listAppointments),
    appointmentController.getAll
);

router.get(
    '/doctor/:doctorId',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO, APP_CONSTANTS.ROLES.ADMIN]),
    appointmentController.getByDoctorId
);

router.get(
    '/patient/:patientId',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkResourceAccess('patient'),
    appointmentController.getByPatientId
);

router.put(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkResourceAccess('appointment'),
    ValidateMiddleware.validateBody(appointmentSchemas.updateAppointment),
    appointmentController.update
);

router.patch(
    '/:id/cancel',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkResourceAccess('appointment'),
    appointmentController.cancel
);

router.patch(
    '/:id/complete',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    RBACMiddleware.checkResourceAccess('appointment'),
    appointmentController.complete
);

export default router;