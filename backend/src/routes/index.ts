// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import patientRoutes from './patient.routes';
import medicalHistoryRoutes from './medical-history.routes';
import appointmentRoutes from './appointment.routes';

const router = Router();

// Prefijos para las rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/medical-histories', medicalHistoryRoutes);
router.use('/appointments', appointmentRoutes);

export default router;