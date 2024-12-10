// src/utils/validation-schemas.ts
import Joi from 'joi';
import { APP_CONSTANTS } from '@/config/constants';

/**
 * Esquemas de validación centralizados para toda la aplicación
 * Utiliza Joi para definir reglas de validación consistentes
 */
export const validationSchemas = {
    // Esquemas de autenticación
    auth: {
        register: Joi.object({
            nombre: Joi.string().required().min(3).max(100),
            email: Joi.string().email().required(),
            password: Joi.string()
                .required()
                .min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
            rol: Joi.string()
                .valid(...Object.values(APP_CONSTANTS.ROLES))
                .required()
        }),

        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    },

    // Esquemas de usuarios
    user: {
        update: Joi.object({
            nombre: Joi.string().min(3).max(100),
            email: Joi.string().email(),
            password: Joi.string()
                .min(8)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
            activo: Joi.boolean()
        })
    },

    // Esquemas de pacientes
    patient: {
        create: Joi.object({
            nombre: Joi.string().required().min(3).max(100),
            fecha_nacimiento: Joi.date().required().less('now'),
            direccion: Joi.string().required(),
            telefono: Joi.string().pattern(/^\+?[\d\s-]+$/),
            email: Joi.string().email(),
            tipo_sangre: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
            alergias: Joi.array().items(Joi.string())
        }),

        update: Joi.object({
            nombre: Joi.string().min(3).max(100),
            direccion: Joi.string(),
            telefono: Joi.string().pattern(/^\+?[\d\s-]+$/),
            email: Joi.string().email(),
            tipo_sangre: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
            alergias: Joi.array().items(Joi.string())
        })
    },

    // Esquemas de historiales médicos
    medicalHistory: {
        create: Joi.object({
            paciente_id: Joi.string().uuid().required(),
            descripcion: Joi.string().required(),
            diagnostico: Joi.string().required(),
            tratamiento: Joi.string().required(),
            archivos_adjuntos: Joi.object()
        }),

        update: Joi.object({
            descripcion: Joi.string(),
            diagnostico: Joi.string(),
            tratamiento: Joi.string(),
            archivos_adjuntos: Joi.object()
        })
    },

    // Esquemas de citas
    appointment: {
        create: Joi.object({
            paciente_id: Joi.string().uuid().required(),
            medico_id: Joi.string().uuid().required(),
            fecha_hora: Joi.date().greater('now').required(),
            motivo: Joi.string().required(),
            notas: Joi.string()
        }),

        update: Joi.object({
            fecha_hora: Joi.date().greater('now'),
            motivo: Joi.string(),
            notas: Joi.string(),
            estado: Joi.string().valid(
                ...Object.values(APP_CONSTANTS.APPOINTMENT_STATUS)
            )
        }),

        query: Joi.object({
            page: Joi.number().min(1),
            limit: Joi.number().min(1).max(100),
            startDate: Joi.date(),
            endDate: Joi.date().min(Joi.ref('startDate')),
            status: Joi.string().valid(
                ...Object.values(APP_CONSTANTS.APPOINTMENT_STATUS)
            )
        })
    }
};