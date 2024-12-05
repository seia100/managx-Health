// src/validators/patient.validator.ts

import Joi from 'joi';

/**
 * @theoreticalBackground
 * Validación de datos de pacientes:
 * - Asegura la integridad de los datos antes de procesamiento
 * - Previene errores de datos inconsistentes
 * - Mejora la experiencia del usuario con mensajes claros
 */

export const patientSchema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder los 100 caracteres',
            'any.required': 'El nombre es requerido'
        }),

    fecha_nacimiento: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'La fecha de nacimiento no puede ser futura',
            'any.required': 'La fecha de nacimiento es requerida'
        }),

    direccion: Joi.string()
        .allow('')
        .optional()
        .max(500)
        .messages({
            'string.max': 'La dirección no puede exceder los 500 caracteres'
        }),

    telefono: Joi.string()
        .pattern(/^\+?[\d\s-]{8,20}$/)
        .optional()
        .messages({
            'string.pattern.base': 'El formato del teléfono no es válido'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'El email debe ser válido'
        }),
    
    // Consideración como historial médico
    tipo_sangre: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .optional()
        .messages({
            'any.only': 'Tipo de sangre no válido'
        }),

    alergias: Joi.array()
        .items(Joi.string().max(100))
        .optional()
        .messages({
            'array.base': 'Las alergias deben ser una lista',
            'string.max': 'Cada alergia no puede exceder los 100 caracteres'
        })
});

// Función de validación genérica
export const validatePatient = (data: any) => patientSchema.validate(data, { 
    abortEarly: false,
    stripUnknown: true 
});