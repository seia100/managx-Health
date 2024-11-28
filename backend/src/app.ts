
// app.ts
import express from 'express';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', patientRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

export default app;
