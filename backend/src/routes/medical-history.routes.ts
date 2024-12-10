// src/routes/medical-history.routes.ts
import { Router } from 'express';
import { MedicalHistoryController } from '../controllers/medical-history.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { RBACMiddleware } from '../middleware/rbac.middleware';
import { ValidateMiddleware } from '../middleware/validate.middleware';
import { medicalHistorySchemas } from '../utils/validation-schemas';
import { APP_CONSTANTS } from '../config/constants';

const router = Router();
const medicalHistoryController = new MedicalHistoryController();

/**
 * Rutas de historiales médicos
 * Requieren autenticación y permisos específicos
 * Implementan verificación de acceso a recursos
 */
router.post(
    '/',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    ValidateMiddleware.validateBody(medicalHistorySchemas.createHistory),
    medicalHistoryController.create
);

router.get(
    '/patient/:patientId',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    RBACMiddleware.checkResourceAccess('patient'),
    medicalHistoryController.getByPatientId
);

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    RBACMiddleware.checkResourceAccess('medical-history'),
    medicalHistoryController.getById
);

router.put(
    '/:id',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    RBACMiddleware.checkResourceAccess('medical-history'),
    ValidateMiddleware.validateBody(medicalHistorySchemas.updateHistory),
    medicalHistoryController.update
);

router.post(
    '/:id/attachments',
    AuthMiddleware.authenticate,
    RBACMiddleware.checkRole([APP_CONSTANTS.ROLES.MEDICO]),
    RBACMiddleware.checkResourceAccess('medical-history'),
    medicalHistoryController.attachFile
);

export default router;