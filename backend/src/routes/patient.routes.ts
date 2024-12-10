// src/routes/patient.routes.ts
import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { RBACMiddleware } from '../middleware/rbac.middleware';
import { ValidateMiddleware } from '../middleware/validate.middleware';
import { patientSchemas } from '../utils/validation-schemas';
import { APP_CONSTANTS } from '../config/constants';

const router = Router();
const patientController = new PatientController();

/**
 * Rutas de pacientes
 * Todas requieren autenticación y roles específicos
 * Se implementa paginación para listados
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO, APP_CONSTANTS.ROLES.ADMIN]),
    ValidateMiddleware.validateBody(patientSchemas.createPatient),
    patientController.create
);

router.get(
    '/',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO, APP_CONSTANTS.ROLES.ADMIN]),
    ValidateMiddleware.validateQuery(patientSchemas.listPatients),
    patientController.getAll
);

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO, APP_CONSTANTS.ROLES.ADMIN]),
    ValidateMiddleware.validateParams(patientSchemas.getPatient),
    patientController.getById
);

router.put(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO, APP_CONSTANTS.ROLES.ADMIN]),
    ValidateMiddleware.validateBody(patientSchemas.updatePatient),
    patientController.update
);

router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.ADMIN]),
    patientController.delete
);

export default router;