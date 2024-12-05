// src/validators/user.validator.ts

import Joi from 'joi';
import { UserRole } from '../interfaces/user.interface';

/**
 * @theoreticalBackground
 * Validación de datos:
 * - Validación preventiva antes de procesamiento: https://hatchjs.com/asp-net-core-fluent-validation-middleware/
 * - Esquemas reutilizables
 * - Mensajes de error personalizados
 */

export const userSchema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder los 100 caracteres',
            'any.required': 'El nombre es requerido'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'El email debe ser válido',
            'any.required': 'El email es requerido'
        }),

    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
        .required()
        .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            'any.required': 'La contraseña es requerida'
        }),

    rol: Joi.string()
        .valid(...Object.values(UserRole))
        .required()
        .messages({
            'any.only': 'Rol no válido',
            'any.required': 'El rol es requerido'
        })
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'El email debe ser válido',
            'any.required': 'El email es requerido'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'La contraseña es requerida'
        })
});

// Función de validación genérica
export const validateUser = (data: any) => userSchema.validate(data, { abortEarly: false });