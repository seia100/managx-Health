// src/routes/medical-record.routes.ts
import { Router } from 'express';
import MedicalRecordController from '../controllers/medical-record.controller';
import AuthMiddleware from '../middlewares/auth.midddleware';
import { UserRole } from '../interfaces/user.interface';

const router = Router();

// Rutas para historiales médicos
router.post(
    '/',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO])
    ],
    MedicalRecordController.createRecord
);

router.get(
    '/patient/:id',
    AuthMiddleware.authenticate,
    MedicalRecordController.getPatientRecords
);

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    MedicalRecordController.getRecordById
);

router.put(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO])
    ],
    MedicalRecordController.updateRecord
);

router.delete(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.ADMINISTRADOR])
    ],
    MedicalRecordController.deleteRecord
);

export default router;