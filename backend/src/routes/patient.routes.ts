// src/routes/patient.routes.ts
import { Router } from 'express';
import PatientController from '../controllers/patient.controller';
import AuthMiddleware from '../middlewares/auth.midddleware';
import { UserRole } from '../interfaces/user.interface';

const router = Router();

/**
 * @route POST /api/patients
 * @access Private - Médicos y Enfermeros
 */
router.post(
    '/',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO, UserRole.ENFERMERO])
    ],
    PatientController.createPatient
);

/**
 * @route GET /api/patients
 * @access Private - Todos los usuarios autenticados
 */
router.get(
    '/',
    AuthMiddleware.authenticate,
    PatientController.getPatients
);

/**
 * @route GET /api/patients/:id
 * @access Private - Todos los usuarios autenticados
 */
router.get(
    '/:id',
    AuthMiddleware.authenticate,
    PatientController.getPatientById
);

/**
 * @route PUT /api/patients/:id
 * @access Private - Médicos y Enfermeros
 */
router.put(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.MEDICO, UserRole.ENFERMERO])
    ],
    PatientController.updatePatient
);

/**
 * @route DELETE /api/patients/:id
 * @access Private - Solo Administradores
 */
router.delete(
    '/:id',
    [
        AuthMiddleware.authenticate,
        AuthMiddleware.authorize([UserRole.ADMINISTRADOR])
    ],
    PatientController.deletePatient
);

export default router;