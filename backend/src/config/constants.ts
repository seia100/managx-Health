// src/config/constants.ts
/**
 * Constantes globales de la aplicación
 * Centralizamos todas las constantes para facilitar su mantenimiento
 * y asegurar consistencia en toda la aplicación
 */
export const APP_CONSTANTS = {
  // Configuración general de la aplicación
    APP: {
        PREFIX: '/api/v1',
        VERSION: '1.0.0',
        NAME: 'Healthcare Platform API'
    },

    // Roles del sistema
    ROLES: {
        ADMIN: 'ADMINISTRADOR',
        DOCTOR: 'MEDICO',
        NURSE: 'ENFERMERO'
    },

    // Estados de las citas
    APPOINTMENT_STATUS: {
        SCHEDULED: 'PROGRAMADA',
        COMPLETED: 'COMPLETADA',
        CANCELLED: 'CANCELADA'
    },

    // Configuración de seguridad
    SECURITY: {
        SALT_ROUNDS: 10,
        TOKEN_EXPIRATION: '24h',
        RATE_LIMIT: {
            WINDOW_MS: 15 * 60 * 1000, // 15 minutos
            MAX_REQUESTS: 100
        }
    },

    // Configuración de caché
    CACHE: {
        TTL: {
        USER: 3600, // 1 hora
        PATIENT: 1800, // 30 minutos
        APPOINTMENT: 900 // 15 minutos
        },
        KEYS: {
            USER_PREFIX: 'user:',
            PATIENT_PREFIX: 'patient:',
            APPOINTMENT_PREFIX: 'appointment:'
        }
    },

    // Mensajes de error comunes
    ERRORS: {
        NOT_FOUND: 'Recurso no encontrado',
        UNAUTHORIZED: 'No autorizado',
        FORBIDDEN: 'Acceso denegado',
        VALIDATION: 'Error de validación',
        DATABASE: 'Error en la base de datos',
        INTERNAL: 'Error interno del servidor'
    }
};
