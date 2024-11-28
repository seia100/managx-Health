// patientRoutes.ts
import { Router } from 'express';
import { createPatient, getPatients } from '../controllers/patientController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', isAuthenticated, createPatient); // Crear paciente
router.get('/', isAuthenticated, getPatients);   // Obtener pacientes

export default router;
