// src/middlewares/validator.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ErrorHandler } from '../utils/error.handler';

/**
 * @theoreticalBackground
 * Middleware de validación:
 *  * More relevant: 
 * - Validación centralizada de requests
 * - Manejo consistente de errores de validación
 * - Reutilización de lógica de validación
 */
export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            
            return ErrorHandler.handleError(
                new ErrorHandler(400, errorMessage),
                res
            );
        }

        next();
    };
};