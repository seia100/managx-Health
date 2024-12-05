// src/validators/medical-record.validator.ts
import Joi from 'joi';

/**
 * Schema de validación para historiales médicos
 * Implementa reglas de negocio y validaciones específicas del dominio médico
 */
export const medicalRecordSchema = Joi.object({
    paciente_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'ID de paciente inválido',
            'any.required': 'ID de paciente es requerido'
        }),

    medico_id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.guid': 'ID de médico inválido',
            'any.required': 'ID de médico es requerido'
        }),

    descripcion: Joi.string()
        .required()
        .min(10)
        .max(2000)
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 2000 caracteres',
            'any.required': 'La descripción es requerida'
        }),

    diagnostico: Joi.string()
        .allow('')
        .max(1000)
        .messages({
            'string.max': 'El diagnóstico no puede exceder 1000 caracteres'
        }),

    tratamiento: Joi.string()
        .allow('')
        .max(1000)
        .messages({
            'string.max': 'El tratamiento no puede exceder 1000 caracteres'
        }),

    archivos_adjuntos: Joi.object()
        .pattern(
            Joi.string(), // key pattern
            Joi.object({
                nombre: Joi.string().required(),
                tipo: Joi.string().required(),
                url: Joi.string().uri().required()
            })
        )
        .max(5) // máximo 5 archivos adjuntos
        .messages({
            'object.max': 'No se pueden adjuntar más de 5 archivos'
        })
});

/**
 * Función de validación para historiales médicos
 * @param data Datos a validar
 * @returns Resultado de la validación
 */
export const validateMedicalRecord = (data: any) => {
    return medicalRecordSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true
    });
};