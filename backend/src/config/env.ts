// env.ts
/**
 * Carga y valida las variables de entorno necesarias para el funcionamiento de la aplicación.
 */
import dotenv from 'dotenv';

// Cargar las variables desde .env
dotenv.config();

// Validar variables críticas
const requiredEnvVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'JWT_SECRET'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`La variable de entorno ${varName} no está definida`);
    }
});

export const ENV = {
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    POSTGRES_DB: process.env.POSTGRES_DB!,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '5432',
    JWT_SECRET: process.env.JWT_SECRET!,
};
